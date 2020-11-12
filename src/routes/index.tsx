import React from 'react';
import { Switch } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import Profile from '../pages/Profile'
import Route from './Route'

export const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forgotpassword" component={ForgotPassword} />
            <Route exact path="/resetpassword" component={ResetPassword} />

            <Route exact path="/dashboard" component={Dashboard} isPrivate />
            <Route exact path="/profile" component={Profile} isPrivate />
        </Switch>
    )
}
