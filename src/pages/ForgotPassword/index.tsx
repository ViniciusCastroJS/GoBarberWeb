import React, {useCallback, useRef, useContext, useState} from 'react';
import { Content, Container, AnimationContainer, Background} from './styles';
import LogoImg from '../../assets/Logo.svg';
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import Btn from '../../components/button';
import Input from '../../components/input';
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup';
import getValidationError from '../../utils/GetValidationError';
import {useToast} from '../../hooks/Toast'
import { Link, useHistory } from 'react-router-dom'
import api from '../../services/api';

interface ForgotPasswordData{
    email: string;
    password: string;
}

const ForgotPassword = () => {
    const Formref = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);

    const HandleSubmit = useCallback( async(data: ForgotPasswordData) => {
        try {
            setLoading(true);

            const Schema = Yup.object().shape({
                email: Yup.string().required("E-mail Obrigatório").email("Digite um e-mail válido"),
            })

            await Schema.validate(data, {
                abortEarly: false
            });

            await api.post('/password/forgot', {
                email: data.email
            });

            addToast({
                type: 'success',
                title: 'Requisição feita com sucesso!',
                description: 'Foi enviando por e-mail sua recuperação de senha'
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
                title: 'Erro na recuperação de senha',
                description: 'Cheque as credenciais'
            });
        } finally{
            setLoading(false);
        }
    }, [addToast])
    
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={LogoImg} alt="Go Barber Logo"/>

                    <Form ref={Formref} onSubmit={HandleSubmit}>
                        <h1> Recuperação de senha </h1>
                        <Input icon={FiMail} name="email" placeholder="E-mail"/>
                        <Btn loading={loading} name="BtnSubmit" type="submit">Enviar</Btn>
                    </Form>
            
                    <Link to="/signin">
                        <FiLogIn/>
                        Voltar ao Login
                    </Link>
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    );
}
export default ForgotPassword;
