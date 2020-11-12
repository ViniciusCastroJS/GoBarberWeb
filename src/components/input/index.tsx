import React, {useCallback, useState, useEffect , InputHTMLAttributes, useRef } from 'react';
import { IconBaseProps } from 'react-icons/lib';
import { FiAlertCircle } from 'react-icons/fi';
import { Field } from './styles';
import { useField } from '@unform/core';
import Tooltip from '../tooltip/index';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { 
    name: string;
    containerStyle?: object;
    icon?: React.ComponentType<IconBaseProps>;
}


const Input: React.FC<InputProps> = ({name, containerStyle = {}, icon: Icon, ...rest}) => {

    const [isFocused, setisFocused] = useState(false);
    const [isFilled, setisFilled] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const {fieldName, defaultValue, error, registerField}  = useField(name) 

    const handleBlur = useCallback(
        () => {
            setisFocused(false);

            setisFilled(!!inputRef.current?.value);
        }, []
    );


    useEffect(
        ()=>{
            registerField({
                name: fieldName,
                ref: inputRef.current,
                path: "value"
            })
        }
    ,[fieldName, registerField]);

    return (    
        <Field 
        isErrored={!!error} 
        isFocused={isFocused} 
        isFilled={isFilled}
        data-testid="inputContainer">

            { Icon && <Icon size={20}/>}
            <input
            style={containerStyle}
            onBlur={handleBlur}
            onFocus={()=>setisFocused(true)}
            defaultValue={defaultValue} 
            ref={inputRef} 
            {...rest}/>

            {error && 
                <Tooltip title={error}>
                    <FiAlertCircle color="#c53030" size={20} />
                </Tooltip> 
            }
        </Field>
    );
}

export default Input;