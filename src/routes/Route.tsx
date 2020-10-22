import React, { Component } from 'react'
import { RouteProps, Route as RouteDOM, Redirect } from 'react-router-dom';
import { useAuth } from '../hooks/auth'

interface IRouteProps extends RouteProps {
    isPrivate?: boolean;
    component: React.ComponentType;
}


const Route: React.FC<IRouteProps> = ({ isPrivate = false, component = Component ,...rest}) => {

    const {user} = useAuth();

    return (
        <RouteDOM
        {...rest}
        render={
            ({location}) => {
                return isPrivate === !!user ? (
                    <Component/>
                ): (
                    <Redirect to={{ pathname: isPrivate ? "/" : "/dashboard", state:{from: location}}}
                    />
                )
            }
        }
        />
    )
}

export default Route
