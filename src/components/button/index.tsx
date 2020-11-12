import React, { ButtonHTMLAttributes } from 'react';
import { Button } from './styles';

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { 
    loading?: boolean;
}

const Btn : React.FC<BtnProps> = ({loading, children, ...rest}) => (
<Button {...rest}>
    { loading ? 'Carregando': children}
</Button>
    );

export default Btn;
