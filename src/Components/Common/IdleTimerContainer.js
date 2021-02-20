import React, { useRef } from 'react'
import IdleTimer from 'react-idle-timer';
import { Link, useHistory } from 'react-router-dom';
import { logout } from '../Common/Utils';

export default function IdleTimerContainer() {

    const history = useHistory();

    const idleTimerRef = useRef(null);

    const onIdle = async () => {
        if (localStorage.getItem('token') && JSON.parse(localStorage.getItem('token')).accessToken) {
            if (await logout()) {
                history.push('/');
                history.go(0);
            }
        }

    }

    return (
        <>
            <IdleTimer ref={idleTimerRef} timeout={20 * 60 * 1000} onIdle={onIdle} />
        </>
    )
}