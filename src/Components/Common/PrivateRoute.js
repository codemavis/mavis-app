import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { APIs } from './APIs';

export default function PrivateRoute({ component: Component, ...rest }) {

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const checkUser = async () => {
        let authToken = localStorage.getItem('token') && JSON.parse(localStorage.getItem('token')).accessToken;
        if (authToken) {
            const requestOptions = { method: 'GET', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` } };
            let res = await fetch(`${APIs.user.getCurrent}`, requestOptions);
            let response = await res.json();
            setIsLoggedIn(response.code == 'ok' ? true : false);
        } else setIsLoggedIn(false);
    }

    useEffect(() => { checkUser(); }, [])

    return (
        <Route {...rest} render={(props) => (
            (isLoggedIn) ? <Component {...props} /> : <Redirect to='/login' />
        )} />
    )
}
