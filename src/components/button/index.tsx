import React, { ButtonHTMLAttributes } from 'react';
import { Button } from './styles';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> { 
    name: string;
}

const Btn : React.FC<BtnProps> = ({children, ...rest}) => (
<Button {...rest}>{children}</Button>
    );

export default Btn;
