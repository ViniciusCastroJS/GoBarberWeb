import {ValidationError} from 'yup'

interface Error {
    [key: string] : string;
}

export default function getValidationError(err: ValidationError): Error {
    const ValidationErrors: Error = {};

    err.inner.forEach(
        error => {
            ValidationErrors[error.path] = error.message
        }
    )

    return ValidationErrors;
}