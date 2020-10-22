import React, { useEffect } from 'react'
import { FiAlertCircle, FiXCircle, FiCheckCircle, FiInfo} from 'react-icons/fi'
import { ObjectType } from 'typescript';
import { useToast, ToastMessage } from '../../../hooks/Toast'
import {Container} from './styles'

interface ToastProps {
    toast: ToastMessage;
    style: object;
};

const icons = {
    info: <FiInfo size={24}/>,
    danger: <FiAlertCircle size={24}/>,
    success: <FiCheckCircle size={24}/>
};


export const Toast: React.FC<ToastProps> = ({toast, style}) => {
    const { removeToast } = useToast();

    useEffect( () => {
        const time = setTimeout( () => { removeToast(toast.id)}, 3000)

        return () => {
            clearTimeout(time)
        };

    }, [removeToast, toast.id])

    return (
    <Container style={style} type={toast.type} hasDescription={!!toast.description}>
        {icons[toast.type]}
        <div>
            <strong>{toast.title}</strong>
            {toast.description && <p>{toast.description}</p> }
        </div>

        <button onClick={() => removeToast(toast.id)} type="button">
            <FiXCircle size={18}/>
        </button>
    </Container>
    )
}
