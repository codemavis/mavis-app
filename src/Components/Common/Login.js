import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { login } from './Utils';
import Avatar3 from '../../Images/avatars/avatar-3.jpg';

export default function Login() {

    const history = useHistory();

    const [currUser, setCurrUser] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const newUser = { ...currUser };

        switch (e.target.name) {
            case 'email':
                newUser.email = e.target.value.toLowerCase();
                break;
            case 'password':
                newUser.password = e.target.value;
                break;
            default:
                break;
        }
        setCurrUser(newUser);
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        console.log(currUser);
        if (await login(currUser)) {
            history.push('/');
            history.go(0);
        }
    }

    return (
        <main className="main h-100 w-100">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">

                            <div className="text-center mt-4">
                                <h1 className="h2 page-head2">Welcome</h1>
                                <p className="lead"> Sign in to your account to continue </p>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="m-sm-4">
                                        <div className="text-center">
                                            <img src={Avatar3} alt="logo" className="img-fluid rounded-circle" width="132" height="132" />
                                        </div>
                                        <form onSubmit={onSubmit} >
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input className="form-control form-control-lg" type="email" name="email" placeholder="Enter your email" onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <input className="form-control form-control-lg" type="password" name="password" placeholder="Enter your password" onChange={handleChange} />
                                                <small>
                                                    <Link to="/reset"> Forgot password? </Link >
                                                </small>
                                            </div>
                                            <div>
                                                <div className="custom-control custom-checkbox align-items-center">
                                                    <input id="customControlInline" type="checkbox" className="custom-control-input" value="remember-me" name="remember-me" />
                                                    <label className="custom-control-label text-small" htmlFor="customControlInline">Remember me next time</label>
                                                </div>
                                            </div>
                                            <div className="text-center mt-3">
                                                <button type="submit" className="btn btn-lg btn-primary">Sign in</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
