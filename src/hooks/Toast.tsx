import React ,{ createContext, useCallback, useContext, useState} from 'react'
import {ToastContainer} from '../components/ToastContainer'
import { uuid } from 'uuidv4'

interface ToastContextData {
    addToast(msg: Omit<ToastMessage, 'id'>): void,
    removeToast(id: string): void 
}

export interface ToastMessage {
    id: string,
    type: "success" | "danger" | "info",
    title?: string,
    description?: string
};

const ContextToast = createContext<ToastContextData>({} as ToastContextData);


const Toast: React.FC = ({children}) => {

    const [messages, setMessages] = useState<ToastMessage[]>([]);

    const addToast = useCallback(({type, title, description}: Omit<ToastMessage, 'id'>) => {
        const id = uuid();

        const toastMessage: ToastMessage = { id, type, title, description };

        setMessages( oldMessages => [...oldMessages, toastMessage]);

    }, [])

    const removeToast = useCallback((id: string) => {
        setMessages( state => state.filter(msg => msg.id !== id));
    }, [])


    return (
        <ContextToast.Provider value = {{addToast, removeToast}}>
            {children}
            <ToastContainer message = {messages}/>
        </ContextToast.Provider>
    )
}

function useToast(): ToastContextData{
    const context = useContext(ContextToast);

    if(!context){
        throw new Error();
    }

    return context;
}

export {useToast, Toast};