import React, { useState, useEffect } from 'react'
import { APIs } from '../../Common/APIs';

export default class PrtUserManager extends React.PureComponent {
    render() {
        return (
            <PrintContent recordid={this.props.recordid} />
        )
    }
}

function PrintContent({ recordid }) {

    const [user, setUser] = useState([])
    const [supervisor, setSupervisor] = useState('')
    const [role, setRole] = useState('')
    const [state, setState] = useState('')

    const _getUser = async (userID) => {
        if (userID) {
            let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
            };
            let res = await fetch(`${APIs.user.get}/${userID}`, requestOptions);
            let response = await res.json();

            console.log('response', response);
            setUser(response);
        }
    }

    const _getState = async (stateID) => {
        if (stateID) {
            let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
            };
            let res = await fetch(`${APIs.list.state}/${stateID}`, requestOptions);
            let response = await res.json();
            if (response.code === 'ok') setState(response.data.text);
        }
    }

    const _getSupervisor = async (recordid) => {
        if (recordid) {
            let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
            };
            let res = await fetch(`${APIs.user.supervisor}/${recordid}`, requestOptions);
            let response = await res.json();
            if (response.code === 'ok') setSupervisor(response.data.text);
        }
    }

    const _getRole = async (roleID) => {
        if (roleID) {
            let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
            };
            let res = await fetch(`${APIs.user.role}/${roleID}`, requestOptions);
            let response = await res.json();
            if (response.code === 'ok') setRole(response.data.text);
        }
    }

    useEffect(async () => {
        if (recordid) await _getUser(recordid);
    }, [])

    useEffect(async () => {
        if (user.supervisor) await _getSupervisor(user.supervisor);
        if (user.userrole) await _getRole(user.userrole);
        if (user.state) await _getState(user.state);
    }, [user])

    return (
        <div>
            <div className="mb-4">
                <strong><h2>User Account</h2></strong>
                <div className="text-muted">User ID</div>
                <strong>{user.userid}</strong>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="text-muted">Username</div>
                    <strong>{user.username}</strong>
                </div>
                <div className="col-md-6 text-md-right1">
                    <div className="text-muted">Record ID</div>
                    <strong>{user.recordid}</strong>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="text-muted">Name</div>
                    <strong>{`${user.firstname} ${user.lastname}`}</strong>
                </div>
                <div className="col-md-6 text-md-right1">
                    <div className="text-muted">Title</div>
                    <strong>{user.jobtitle}</strong>
                </div>
            </div>


            <hr className="my-4" />

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="text-muted">Email</div>
                    <strong>{user.email}</strong>
                </div>
                <div className="col-md-6 text-md-right1">
                    <div className="text-muted">Supervisor</div>
                    <strong>{supervisor}</strong>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="text-muted">Phone</div>
                    <strong>{user.phone}</strong>
                </div>
                <div className="col-md-6 text-md-right1">
                    <div className="text-muted">Mobile</div>
                    <strong>{user.mobile}</strong>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="text-muted">Address</div>
                    <strong>
                        <p>
                            {user.addr1} <br className={user.addr1 ? '' : 'd-none'} />
                            {user.addr2}  <br className={user.addr2 ? '' : 'd-none'} />
                            {user.city}<br className={user.city ? '' : 'd-none'} />
                            {state} <br className={user.state ? '' : 'd-none'} />
                            {user.zip}
                        </p> </strong>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="text-muted">Bio</div>
                    <strong>{user.bio}</strong>
                </div>

                <div className="col-md-6 text-md-right1">
                    <div className="text-muted">User Role</div>
                    <strong>{role}</strong>
                </div>
            </div>
        </div>
    )
}