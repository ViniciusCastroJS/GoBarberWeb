import React  from 'react'
import {AuthProvider} from './auth'
import {Toast as ToastProvider} from './Toast'

export const AppProvider: React.FC = ({children}) => {
    return (
        <AuthProvider>
            <ToastProvider>
                {children}
            </ToastProvider>
        </AuthProvider>
    )
}


export default AppProvider;
