import styled, {css} from 'styled-components';

import Tooltip from '../tooltip/index';

interface FieldProps{
    isFocused: boolean;
    isFilled: boolean;
    isErrored: boolean;
}

export const Field = styled.div<FieldProps>`
    color: #f4ede8;
    background: #232129;
    border: 2px solid #232129;
    padding: 16px;
    width: 100%;
    border-radius:10px;
    display: flex;
    align-items: center;

    
    & + div {
        margin-top: 8px;
    }


    ${props => props.isErrored && css`
    border-color:#c53030;
    color: #c53030;
`}
    ${props => props.isFocused && css`
        border-color:#ff9000;
    `}

    
    svg{
        margin-right: 16px;
        color: #666360;
    }

    input{
        background: transparent;
        border: none;
        flex: 1;
        color: #f4ede8;
        
        &::placeholder{
            color: #666360;
        }
                    
        & + input{
            margin-top: 8px;
        }

        ${props => props.isFilled && css`
        color:#ff9000;
` }
    }`

export const Error = styled(Tooltip)`
    height: 20px;   
    margin-left: 16px;

    svg{
        margin: 0;
    }

    span{
        background: #c53030;
        color:#fff;
    }

    &::before{
        border-color: #ff9000 transparent;
    }

`;