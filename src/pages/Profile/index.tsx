import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Content, Container, AvatarInput} from './styles';
import { FiUser, FiLock, FiMail, FiCamera, FiArrowLeft } from "react-icons/fi";
import Btn from '../../components/button';
import Input from '../../components/input';
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup';
import getValidationError from '../../utils/GetValidationError';
import {Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';
import { useAuth } from '../../hooks/auth';


interface ProfileFormData{
    name: string;
    email: string;
    old_password: string;
    password: string;
    passwordConfirmation: string;
}


const Profile: React.FC = () =>{

    const Formref = useRef<FormHandles>(null);
    const { addToast} = useToast();
    const history = useHistory();
    const {user, updateUser} = useAuth();

    const handleAvatarChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
           
            if (e.target.files) {
                const data = new FormData();

                data.append('avatar', e.target.files[0]);

                api.patch('/users/avatar', data).then(
                    response => {

                        updateUser(response.data);

                        addToast({
                            type: 'success',
                            title: 'Perfil Atualizado',
                            description: 'Tudo certo!'
                        });
                    }
                )
            }


        },
        [addToast, updateUser],
    )


    const HandleSubmit = useCallback( async(data: ProfileFormData) => {
        try {
            const Schema = Yup.object().shape({
                name: Yup.string().required("Nome Obrigatório"),
                email: Yup.string().required("E-mail Obrigatório").email("Digite um e-mail válido"),
                password: Yup.string().when('old_password',
                 {
                    is: val => !!val.length, 
                    then: Yup.string().required(), 
                    otherwise: Yup.string()
                }),
                old_password: Yup.string().required(" Senha Obrigatória"),
                passwordConfirmation: Yup.string().when('old_password',
                {
                   is: val => !!val.length, 
                   then: Yup.string().required(), 
                   otherwise: Yup.string()
               }),
            })

            await Schema.validate(data, {
                abortEarly: false
            });

            const FormResponseData = Object.assign({
                name: data.name,
                email: data.email
            }, data.old_password ? {
                old_password: data.old_password,
                password: data.password,
                passwordConfirmation: data.passwordConfirmation
            } : {});

            const response = await api.put('/profile', data);

            updateUser(response.data);

            history.push('/dashboard');
            addToast({ title:"Usuario atualizado com sucesso", type:"success"});

        } catch (error) {
            if(error instanceof Yup.ValidationError)
            {
                const errors = getValidationError(error);
    
                Formref.current?.setErrors(errors)

                return;
            }

            addToast({
                type: 'danger',
                title: 'Erro na Atualização',
                description: 'verifique os campos'
            });
        }
    }, [addToast, history])

    return (
        <Container>

        <header>
            <div>
                <Link to="/dashboard">
                    <FiArrowLeft/>
                </Link>
            </div>
        </header>

            <Content>
                <Form ref={Formref} initialData={{
                    name: user.name, email: user.email
                }} onSubmit={HandleSubmit}>
                <AvatarInput>
                    <img src={user.avatar_url} alt={user.name}/>
                    <label htmlFor="avatar">
                        <FiCamera/>
                        <input type="file" id="avatar" onChange={handleAvatarChange}/>
                    </label>

                </AvatarInput>
                
                <h1>Meu Perfil</h1>

                <Input icon={FiUser} name="name" placeholder="nome"/>
                <Input icon={FiMail} name="email" placeholder="e-mail"/>
                <Input icon={FiLock} containerStyle={{marginTop: 24}} name="old_password" type="password" placeholder="Sua senha atual"/>
                <Input icon={FiLock} name="password" type="password" placeholder="Nova Senha"/>                
                <Input icon={FiLock} name="password_confirmation" type="password" placeholder="Confirme sua Senha"/>
                <Btn name="BtnSubmit" type="submit">Salvar Mudanças</Btn>

                </Form>
            </Content>
        </Container>
    );
};

export default Profile;
