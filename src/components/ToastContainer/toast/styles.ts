import styled, {css} from 'styled-components';
import { animated} from 'react-spring';

const ToastVariations = {
    info: css`
        background: #ebf8ff;
        color: #3172b7;
    `,
    success: css`
        background: #e6fffa;
        color: #2e656a;
    `,
    danger: css`
        background: #fddede;
        color: #c53030;
    `,    
}

interface ToastProps{
    type: "success" | "danger" | "info",
    hasDescription?: boolean;
}


export const Container = styled(animated.div)<ToastProps>`
    width: 360px;
    position: relative;
    padding: 16px 30px 16px 16px;
    border-radius:10px;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    background: #ebf8ff;
    color: #3172b7;

    & + div {
        margin-top: 8px;
    }

    ${ props => ToastVariations[props.type]}


    > svg {
        margin: 4px 12px 0 0;
    }

    div {
        flex: 1;

        p {
            margin-top:4px;
            font-size: 14px;
            opacity: 0.8;
            line-height: 20px;
        }
    }

    button{
        position: absolute;
        right: 8px;
        top: 15px;
        opacity: 0.6;
        border: 0;
        background: transparent;
        color: inherit;
    }

    ${props => !props.hasDescription && css`
        align-items: center;
        
        svg{
            margin-top: 0;
        }
    `}
`;
