import React from 'react'
import {ToastMessage, useToast} from '../../hooks/Toast'
import { Container } from './styles'
import { Toast } from './toast';
import { useTransition} from 'react-spring';
/* eslint no-use-before-define: 0 */

interface ToastContainerProps{
    message?: ToastMessage[];
};

export const ToastContainer: React.FC<ToastContainerProps> = ( props ) => {

    const {message} = props;
    const messageWithTransition = useTransition(
        message,
         msg => msg.id,
         {
            from:{ right: '-120%', opacity: 0},
            enter:{ right: '0%', opacity: 1},
            leave:{ right: '-120%', opacity: 0}
         });

    return (
        <Container>
            {messageWithTransition.map(
                ({item, key, props}) => {
                    <Toast key={key} style={props} toast={item}/>
                }
            )}
        </Container>
    )
}
