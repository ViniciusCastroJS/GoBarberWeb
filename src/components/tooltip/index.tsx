import React from 'react';
import { Container } from './styles'

interface tooltipProps {
    title: string;
    className?: string;
}

const Tooltip: React.FC<tooltipProps> = ({className = "", title, children}) => {
    return (
        <Container className={className}>
            {children}
            <span>{title}</span>
        </Container>
    )
}

export default Tooltip;