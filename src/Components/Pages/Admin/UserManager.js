import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';

import Avatar from '../../../Images/avatars/avatar.jpg';
import Divider from '../../../Images/commons/divider.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faPrint, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import AddSelect from '../../Common/AddSelect'
import Header from '../../Common/Header';
import MessageBox from '../../Common/MessageBox';
import ModalPopup from '../../Common/ModalPopup'
import { APIs } from '../../Common/APIs';
import StateSelect from '../../SelectOptions/StateSelect';

export default function UserManager({ match }) {

    const currPage = { pageType: 'Master Files', pageGroup: 'Admin', pageName: 'User Account' }

    const initialUser = { "username": "", "bio": "", "userid": "", "jobtitle": "", "firstname": "", "lastname": "", "supervisor": 0, "email": "", "phone": "", "mobile": "", "addr1": "", "addr2": "", "city": "", "state": 0, "zip": "", "password": "", "giveaccess": false, "userrole": 0 }
    const history = useHistory();

    //Modal Popup
    const [modalShow, setModalShow] = useState(false);
    const [confirmValue, setConfirmValue] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [modalContent, setModalContent] = useState('');

    //Message Box
    const [msgShow, setMsgShow] = useState('d-none');
    const [msgClass, setMsgClass] = useState('success');
    const [msgTitle, setMsgTitle] = useState('');
    const [msgContent, setMsgContent] = useState('');

    const [currMode, setCurrMode] = useState('edit-mode');
    const [isDisabled, setIsDisabled] = useState(true);
    const [states, setStates] = useState([]);
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState(initialUser);
    const [confirmPwd, setConfirmPwd] = useState('');
    const [supervisors, setSupervisors] = useState([]);
    const [cMode, setCMode] = useState('init');
    const [toolBar, setToolBar] = useState('');
    const [recordID, setrecordID] = useState(0)

    const getUser = async (userID) => {
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
        } else
            setUser(initialUser);
    }

    const dataPrev = async () => {
        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        let res = await fetch(`${APIs.user.prev}/${match.params.id}`, requestOptions);

        let response = await res.json();
        if (response.code === "ok")
            if (response.result.previd) {
                updatePath(response.result.previd);
                //  setrecordID(response.result.previd)
            }
    }

    const dataNext = async () => {
        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        let res = await fetch(`${APIs.user.next}/${match.params.id}`, requestOptions);
        let response = await res.json();
        console.log('response', response);
        if (response.code === "ok")
            if (response.result.nextid) {
                updatePath(response.result.nextid);
                // setrecordID(response.result.nextid);
            }
    }

    const dataDelete = async () => {
        setModalHeading('Confirmation');
        setModalContent('Are you sure you want to delete this record?');
        setCMode('delete');
        setModalShow(true);
    }

    const deleteRecord = async () => {
        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        let res = await fetch(`${APIs.user.delete}/${match.params.id}`, requestOptions);
        let response = await res.json();


        showMessage('Confirmation', response.message, 'danger');

        if (response.code === "ok") {
            history.push('/list/user');
            history.go(0);
        }
    }

    const dataPrint = () => {
        alert('Print');
    }

    const updatePath = (id) => {
        const path = generatePath(match.path, { id });
        history.replace(path);
        history.go(0);
    }

    const _setObjects = () => {
        switch (cMode) {
            case 'new':
                setCurrMode('edit-mode');
                setIsDisabled(false);
                setToolBar(<>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <Link to="/"> <button type="button" className="btn btn-light">Cancel</button></Link>
                    <img src={Divider} className="divider" />
                    <button type="button" onClick={() => getUser(match.params.id)} className="btn btn-light tool-bar-list">Reset</button>
                </>);

                break;
            case 'edit':
                setCurrMode('edit-mode');
                setIsDisabled(false);
                setConfirmPwd('');
                setToolBar(<>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <Link to={`/admin/user/${match.params.id}`}><button type="button" className="btn btn-light">Cancel</button></Link>
                    <img src={Divider} className="divider" />
                    <button type="button" onClick={() => getUser(match.params.id)} className="btn btn-light tool-bar-list">Reset</button>
                </>);
                break;
            case 'view':
                setCurrMode('view-mode');
                setIsDisabled(true);
                setToolBar(<>
                    <Link to={`/admin/user/${match.params.id}/e`}><button type="button" className="btn btn-primary">Edit</button></Link>
                    <Link to="/"> <button type="button" className="btn btn-light">Back</button></Link>
                    <img src={Divider} className="divider" />
                    <button type="button" onClick={dataDelete} className="btn btn-light tool-bar-list"><FontAwesomeIcon icon={faTrash} /></button>
                    <Link to={`/print/admin/user/${match.params.id}`}><button type="button" className="btn btn-light mr-1"><FontAwesomeIcon icon={faPrint} /> </button></Link>
                </>);
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (match.params.mode == 'e')
            setCMode('edit');
        else if (match.params.mode == 'v')
            setCMode('view');
        else if (match.params.id)
            setCMode('view');
        else
            setCMode('new');

        getUser(match.params.id);
    }, [match.params.id, match.params.mode]);

    useEffect(() => {
        if (confirmValue) {
            if (cMode === 'delete') {
                deleteRecord();
            }
            setCMode('view')
        }
        setConfirmValue(false)
    }, [confirmValue]);

    useEffect(() => {
        _setObjects();
    }, [cMode])

    // useEffect(() => {
    //     setrecordID(match.params.id);
    // }, [match.params.id])

    const _getStates = async () => {

        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };

        let response = await fetch(APIs.list.state, requestOptions);
        let res = await response.json();

        if (res.code == 'ok') { setStates(res.data); }
    }

    const _getRoles = async () => {
        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };

        let response = await fetch(`${APIs.user.role}`, requestOptions);
        let res = await response.json();

        if (res.code == 'ok') { setRoles(res.data); }

    }

    const _getSupervisors = async () => {

        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;

        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };

        let response = await fetch(`${APIs.user.supervisors}/${match.params.id || 0}`, requestOptions);
        let res = await response.json();

        if (res.code == 'ok') { setSupervisors(res.data); }
    }

    useEffect(() => {
        _getStates();
        _getRoles();
        _getSupervisors();
    }, [])

    const onSubmit = (e) => {

        e.preventDefault();
        console.log('user', user);
        if (!validateEntries()) return false;

        //API Call
        let isSaved = saveData();
        // let isSaved = await saveData();
        //  if (isSaved) history.push(`/admin/user/${match.params.id}`);

    }

    const handleChange = (e) => {

        const newUser = { ...user };

        console.log('newUser', newUser);

        switch (e.target.name) {
            case 'username':
            case 'bio':
            case 'userid':
            case 'jobtitle':
            case 'firstname':
            case 'lastname':
            case 'supervisor':
            case 'phone':
            case 'mobile':
            case 'addr1':
            case 'addr2':
            case 'city':
            case 'state':
            case 'zip':
            case 'password':
            case 'userrole':
                newUser[e.target.name] = e.target.value;
                break;
            case 'email':
                newUser.email = e.target.value.toLowerCase();
                break;
            case 'confirmpassword':
                setConfirmPwd(e.target.value);
                break;
            case 'giveaccess':
                newUser.giveaccess = e.target.checked;
                break;
            default:
                break;
        }
        setUser(newUser);
    }

    const validateEntries = () => {

        if (!user.firstname) {
            showMessage('Validation', 'Invalid First Name', 'danger')
            return false;
        }

        if (!user.lastname) {
            showMessage('Validation', 'Invalid Last Name', 'danger')
            return false;
        }

        if (!user.email) {
            showMessage('Validation', 'Invalid Email Address', 'danger')
            return false;
        }

        if (!user.password) {
            showMessage('Validation', 'Invalid Password', 'danger')
            return false;
        }

        if (user.password !== confirmPwd) {
            showMessage('Validation', 'Passwords didn\'t match. Try again.', 'danger')
            return false;
        }

        return true;
    }

    const saveData = async () => {

        let url, method, body;
        switch (cMode) {
            case 'new':
                url = `${APIs.user.create}`;
                method = 'POST';
                break;
            case 'edit':
                url = `${APIs.user.edit}/${match.params.id}`;
                method = 'PUT';
                let objUser = delete user['recordid'];
                setUser(objUser);
                break;
            default:
                break;
        }

        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;

        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify(user)
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log('data', data);

        if (data.code === 'ok') {
            showMessage('Confirmation', data.message, 'success')
            history.push(`/admin/user/${match.params.id || data.recordid}`);
        } else
            showMessage('Confirmation', data.message, 'danger')

    }

    const showMessage = (title, content, classType) => {
        setMsgTitle(title);
        setMsgContent(content);
        setMsgClass(classType);
        setMsgShow('');

        setTimeout(() => {
            setMsgShow('d-none');
        }, 10000);
    }

    return (
        <main className="content">
            <div className="container-fluid">
                <Header currPage={currPage} />

                <div className="row">
                    <div className="col-md-3 col-xl-2">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Profile Settings</h5>
                            </div>

                            <div className="list-group list-group-flush" role="tablist">
                                <a className="list-group-item list-group-item-action active" data-toggle="list" href="#account" role="tab"> Account </a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#contact" role="tab"> Contact </a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#access" role="tab"> Access </a>
                                {/* <a className="list-group-item list-group-item-action" data-toggle="list" href="#" role="tab"> Email notifications </a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#" role="tab"> Web notifications  </a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#" role="tab">  Widgets </a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#" role="tab"> Your data  </a>
                                <a className="list-group-item list-group-item-action" data-toggle="list" href="#" role="tab">  Delete account </a> */}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-9 col-xl-10">
                        <form id="user-form" onSubmit={onSubmit}>
                            <div className="tab-content">
                                <div className="card">
                                    <div className="card-header">
                                        <MessageBox msgShow={msgShow} msgClass={msgClass} msgTitle={msgTitle} msgContent={msgContent} />
                                        <ModalPopup modalShow={modalShow} modalClose={() => setModalShow(false)} confirmValue={setConfirmValue} modalHeading={modalHeading} modalContent={modalContent} />
                                        {/* <AlertBox /> */}
                                        <div className="card-actions tool-bar">
                                            {toolBar}
                                            <div className=" float-right ">
                                                <a onClick={dataPrev} hidden={!isDisabled} className="mr-1 tool-bar-list"> <FontAwesomeIcon className="align-middle" icon={faArrowLeft} /> </a>
                                                <a onClick={dataNext} hidden={!isDisabled} className="mr-1 tool-bar-list"> <FontAwesomeIcon className="align-middle" icon={faArrowRight} /> </a>
                                                <Link to="/list/user" className="tool-bar-list">List</Link>
                                            </div>

                                            <div className="d-inline-block dropdown show">
                                                <a href="#" data-toggle="dropdown" data-display="static">
                                                    <i className="align-middle" data-feather="more-vertical"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-left">
                                                    <a className="dropdown-item" href="#">New</a>
                                                    <a className="dropdown-item" href="#">Copy</a>
                                                    <a className="dropdown-item" href="#">PDF</a>
                                                </div>
                                            </div>

                                        </div>
                                        <h5 className="card-title mb-0">Public info</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <div className="form-group">
                                                    <label htmlFor="username">Username</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="username" name="username" placeholder="Username" value={user.username} onChange={handleChange} />
                                                    <label id="validation-required-error" className="error jquery-validation-error small form-text invalid-feedback" htmlFor="validation-required">This field is required.</label>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="bio">Biography</label>
                                                    <textarea rows="2" className={`form-control ${currMode}`} disabled={isDisabled} id="bio" name="bio" placeholder="Tell something about yourself" value={user.bio} onChange={handleChange}></textarea>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="text-center">
                                                    <img alt="Chris Wood" src={Avatar} className="rounded-circle img-responsive mt-2" width="128" height="128" />
                                                    <div className="mt-2">
                                                        <span className="btn btn-primary"><FontAwesomeIcon icon={faUpload} /> Upload</span>
                                                        <input className="btn btn-primary" type="file" name="image" id="image" hidden />
                                                    </div>
                                                    <small>For best results, use an image at least 128px by 128px in .jpg format</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade show active" id="account" role="tabpanel">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="card-actions float-right">
                                                <a href="#" className="mr-1">
                                                    <i className="align-middle" data-feather="refresh-cw"></i>
                                                </a>
                                                <div className="d-inline-block dropdown show">
                                                    <a href="#" data-toggle="dropdown" data-display="static">
                                                        <i className="align-middle" data-feather="more-vertical"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item" href="#">Action</a>
                                                        <a className="dropdown-item" href="#">Another action</a>
                                                        <a className="dropdown-item" href="#">Something else here</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <h5 className="card-title mb-0">Primary Information</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="userid">User ID</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="userid" name="userid" value={user.userid} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="jobtitle">Job Title</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="jobtitle" name="jobtitle" value={user.jobtitle} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="firstname">First name</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="firstname" name="firstname" value={user.firstname} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="lastname">Last name</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="lastname" name="lastname" value={user.lastname} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="supervisor">Supervisor</label>
                                                    {/* <input type="text" className={ `form-control ${currMode}` } id="supervisor" name="supervisor" value={user.supervisor} onChange={handleChange} /> */}
                                                    <select id="supervisor" name="supervisor" className={`form-control ${currMode}`} disabled={isDisabled} value={user.supervisor} onChange={handleChange}>
                                                        <option defaultValue="selected">Choose...</option>
                                                        <AddSelect options={supervisors} />
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade" id="contact" role="tabpanel">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="card-actions float-right">
                                                <a href="#" className="mr-1">
                                                    <i className="align-middle" data-feather="refresh-cw"></i>
                                                </a>
                                                <div className="d-inline-block dropdown show">
                                                    <a href="#" data-toggle="dropdown" data-display="static">
                                                        <i className="align-middle" data-feather="more-vertical"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item" href="#">Action</a>
                                                        <a className="dropdown-item" href="#">Another action</a>
                                                        <a className="dropdown-item" href="#">Something else here</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <h5 className="card-title mb-0">Email | Phone | Address</h5>
                                        </div>
                                        <div className="card-body">

                                            <div className="form-group">
                                                <label htmlFor="email">Email</label>
                                                <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} name="email" name="email" value={user.email} onChange={handleChange} />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="phone">Phone</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="phone" name="phone" value={user.phone} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="mobile">Mobile</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="mobile" name="mobile" value={user.mobile} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="addr1">Address Line 1</label>
                                                <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="addr1" name="addr1" value={user.addr1} onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="addr2">Address Line 2</label>
                                                <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="addr2" name="addr2" value={user.addr2} onChange={handleChange} />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="city">City</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="city" name="city" value={user.city} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="state">State</label>
                                                    {/* <select id="state" name="state" className={`form-control ${currMode}`} disabled={isDisabled} value={user.state} onChange={handleChange}>
                                                        <option defaultValue="selected">Choose...</option>
                                                        <AddSelect options={states} />
                                                    </select> */}
                                                    <StateSelect id="state" name="state" className={`form-control ${currMode}`} disabled={isDisabled} value={user.state} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="zip">Zip</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="zip" name="zip" value={user.zip} onChange={handleChange} />
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                </div>


                                <div className="tab-pane fade" id="access" role="tabpanel">
                                    <div className="card">
                                        <div className="card-header">
                                            <div className="card-actions float-right">
                                                <a href="#" className="mr-1">
                                                    <i className="align-middle" data-feather="refresh-cw"></i>
                                                </a>
                                                <div className="d-inline-block dropdown show">
                                                    <a href="#" data-toggle="dropdown" data-display="static">
                                                        <i className="align-middle" data-feather="more-vertical"></i>
                                                    </a>
                                                    <div className="dropdown-menu dropdown-menu-right">
                                                        <a className="dropdown-item" href="#">Action</a>
                                                        <a className="dropdown-item" href="#">Another action</a>
                                                        <a className="dropdown-item" href="#">Something else here</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <h5 className="card-title mb-0">Access</h5>
                                        </div>
                                        <div className="card-body">

                                            <div className="form-row" hidden={isDisabled}>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="password">Password</label>
                                                    <input type="password" className={`form-control ${currMode}`} disabled={isDisabled} id="password" name="password" value={user.password} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="confirmpassword">Confirm Password</label>
                                                    <input type="password" className={`form-control ${currMode}`} disabled={isDisabled} hidden={isDisabled} name="confirmpassword" value={confirmPwd} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="userrole">User Role</label>
                                                    <select id="userrole" className={`form-control ${currMode}`} disabled={isDisabled} name="userrole" value={user.userrole} onChange={handleChange}>
                                                        <option defaultValue="selected">Choose...</option>
                                                        <AddSelect options={roles} />
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group  col-md-3">
                                                    <label className="custom-control custom-checkbox d-block">
                                                        <input type="checkbox" className="custom-control-input" name="giveaccess" checked={user.giveaccess} onChange={handleChange} />
                                                        <span className="custom-control-label">Give Access</span>
                                                    </label>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
