import React, {useCallback, useRef, useState} from 'react';
import { Content, Container, AnimationContainer, Background} from './styles';
import LogoImg from '../../assets/Logo.svg';
import {FiLock } from "react-icons/fi";
import Btn from '../../components/button';
import Input from '../../components/input';
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup';
import getValidationError from '../../utils/GetValidationError';
import {useToast} from '../../hooks/Toast'
import { useHistory, useLocation } from 'react-router-dom'
import api from '../../services/api';

interface ResetPasswordData{
    passwordConfirmation: string;
    password: string;
}

const ResetPassword = () => {
    const Formref = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const HandleSubmit = useCallback( async(data: ResetPasswordData) => {
        try {
            setLoading(true);

            const Schema = Yup.object().shape({
                password: Yup.string().required(" Senha Obrigatória"),
                passwordConfirmation: Yup.string().oneOf([Yup.ref('password')], 'As Senhas não Coincidem'),
            })

            await Schema.validate(data, {
                abortEarly: false
            });

            const token = location.search.replace('?token=', '');

            if(!!token){
                throw new Error();
            }

            await api.post('/password/reset', {
                password: data.password,
                passwordConfirmation: data.passwordConfirmation,
                token
            })


            history.push('/');

            addToast({
                type: 'success',
                title: 'Requisição feita com sucesso!',
                description: 'Sua senha foi alterada'
            });

        } catch (error) {
            if(error instanceof Yup.ValidationError)
            {
                const errors = getValidationError(error);
    
                Formref.current?.setErrors(errors)

                return;
            }

            addToast({
                type: 'danger',
                title: 'Erro em alterar a senha',
                description: 'Cheque as credenciais'
            });
        } finally{
            setLoading(false);
        }
    }, [addToast, history, location.search])
    
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={LogoImg} alt="Go Barber Logo"/>

                    <Form ref={Formref} onSubmit={HandleSubmit}>
                        <h1> Recuperação de senha </h1>
                        <Input icon={FiLock} name="password" placeholder="Sua Nova Senha"/>
                        <Input icon={FiLock} name="passwordConfirmation" placeholder="Confirme sua senha"/>
                        <Btn loading={loading} name="BtnSubmit" type="submit">Enviar</Btn>
                    </Form>
            
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    );
}
export default ResetPassword;
