import React, { useCallback, useRef } from 'react';
import { Content, Container, Background, AnimationContainer} from './styles';
import LogoImg from '../../assets/Logo.svg';
import { FiUser, FiLock, FiArrowLeft, FiMail } from "react-icons/fi";
import Btn from '../../components/button';
import Input from '../../components/input';
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup';
import getValidationError from '../../utils/GetValidationError';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';
import { useToast } from '../../hooks/Toast';

const SignUp = () =>{

    const Formref = useRef<FormHandles>(null);
    const { addToast} = useToast();
    const history = useHistory();

    const HandleSubmit = useCallback( async(data: Object) => {
        try {
            const Schema = Yup.object().shape({
                name: Yup.string().required("Nome Obrigatório"),
                email: Yup.string().required("E-mail Obrigatório").email("Digite um e-mail válido"),
                password: Yup.string().required(" Senha Obrigatória").min(6, "Sua senha precisa ter, no minímo, 6 caracteres.")
            })

            await Schema.validate(data, {
                abortEarly: false
            });

            await api.post('/users', data);
            addToast({ title:"Usuario cadastrado com sucesso", type:"success"});
            history.push('/');

        } catch (error) {
            if(error instanceof Yup.ValidationError)
            {
                const errors = getValidationError(error);
    
                Formref.current?.setErrors(errors)

                return;
            }

            addToast({
                type: 'danger',
                title: 'Erro no Cadastro',
                description: 'verifique os campos'
            });
        }
    }, [addToast, history])

    return (
        <Container>
            <Background/>
            <Content>
                <AnimationContainer>
                    <img src={LogoImg} alt="Go Barber Logo"/>

                    <Form ref={Formref} onSubmit={HandleSubmit}>
                        <h1> Faça seu cadastro</h1>
                        <Input icon={FiUser} name="name" placeholder="nome"/>
                        <Input icon={FiMail} name="email" placeholder="e-mail"/>
                        <Input icon={FiLock} name="password" type="password" placeholder="Password"/>
                        <Btn name="BtnSubmit" type="submit">Cadastrar</Btn>

                    </Form>
            
                    <Link to="/">
                        <FiArrowLeft/>
                        Voltar para Login
                    </Link>
                </AnimationContainer>
            </Content>
    </Container>
    );
};

export default SignUp;
