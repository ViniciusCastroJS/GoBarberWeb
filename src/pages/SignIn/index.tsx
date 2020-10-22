import React, {useCallback, useRef, useContext} from 'react';
import { Content, Container, AnimationContainer, Background} from './styles';
import LogoImg from '../../assets/Logo.svg';
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import Btn from '../../components/button';
import Input from '../../components/input';
import { Form } from '@unform/web'
import { FormHandles } from '@unform/core'
import * as Yup from 'yup';
import getValidationError from '../../utils/GetValidationError';
import {useAuth} from '../../hooks/auth'
import {useToast} from '../../hooks/Toast'
import { Link, useHistory } from 'react-router-dom'

interface SignInFormData{
    email: string;
    password: string;
}

const SignIn = () => {
    const Formref = useRef<FormHandles>(null);

    const { signIn } = useAuth();
    const { addToast } = useToast();
    const history = useHistory();

    const HandleSubmit = useCallback( async(data: SignInFormData) => {
        try {
            const Schema = Yup.object().shape({
                email: Yup.string().required("E-mail Obrigatório").email("Digite um e-mail válido"),
                password: Yup.string().required(" Senha Obrigatória")   
            })

            await Schema.validate(data, {
                abortEarly: false
            });

            await signIn({
                email: data.email,
                password: data.password
            });

            history.push('/dashboard');

        } catch (error) {
            if(error instanceof Yup.ValidationError)
            {
                const errors = getValidationError(error);
    
                Formref.current?.setErrors(errors)

                return;
            }

            addToast({
                type: 'danger',
                title: 'Erro na autenticação',
                description: 'Cheque as credenciais'
            });
        }
    }, [signIn, addToast, history])
    
    return (
        <Container>
            <Content>
                <AnimationContainer>
                    <img src={LogoImg} alt="Go Barber Logo"/>

                    <Form ref={Formref} onSubmit={HandleSubmit}>
                        <h1> Faça seu Log On</h1>
                        <Input icon={FiMail} name="email" placeholder="E-mail"/>
                        <Input icon={FiLock} name="password" type="password" placeholder="Password"/>
                        <Btn name="BtnSubmit" type="submit">Enviar</Btn>

                        <Link to="/forgetpassword">Esqueci minha senha</Link>

                    </Form>
            
                    <Link to="/signup">
                        <FiLogIn/>
                        Criar Conta
                    </Link>
                </AnimationContainer>
            </Content>
            <Background/>
        </Container>
    );
}
export default SignIn;
