import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { generatePath } from 'react-router';

import Divider from '../../../Images/commons/divider.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faSearch, faPrint, faTrash, faUpload, faTimes, faPlus, faCalculator } from '@fortawesome/free-solid-svg-icons'
import AddSelect from '../../Common/AddSelect'
import Header from '../../Common/Header';
import MessageBox from '../../Common/MessageBox';
import ModalPopup from '../../Common/ModalPopup'
import { APIs } from '../../Common/APIs';
import LocationSelect from '../../SelectOptions/LocationSelect';
import CurrencySelect from '../../SelectOptions/CurrencySelect';
import POTypeSelect from '../../SelectOptions/POTypeSelect';
import ItemSelect from '../../SelectOptions/ItemSelect';
import StateSelect from '../../SelectOptions/StateSelect';
import DateSelect from '../../SelectOptions/DateSelect';
import SupplierSelect from '../../SelectOptions/SupplierSelect';

export default function PurchaseOrder({ match }) {

    const currPage = { pageType: 'Transaction', pageGroup: 'Purchasing', pageName: 'Purchase Order' }
    const history = useHistory();
    let initialPOHed = { refno: "", manualref: "", trandate: "", currency: "", exchangerate: "", potype: "", supplier: "", location: "", memo: "", contactperson: "", addr1: "", addr2: "", city: "", state: "", zip: "", expdeldate: "", contactnumber: "" };
    const initialPODet = { "id": 1, "item": "", "quantity": "", "purchaseprice": "", "discount": "", "value": "", "tax": "", "grossvalue": "" };

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
    const [lineValidateMsg, setLineValidateMsg] = useState("")

    const [currMode, setCurrMode] = useState('edit-mode');
    const [isDisabled, setIsDisabled] = useState(true);
    const [states, setStates] = useState([]);
    const [count, setCount] = useState(0)

    const [poHed, setPOHed] = useState(initialPOHed);
    const [poDet, setPODet] = useState({ 1: initialPODet });
    const [totals, setTotals] = useState({ totaldiscount: 0, totaltax: 0, subtotal: 0, total: 0 })

    const [cMode, setCMode] = useState('init');
    const [toolBar, setToolBar] = useState('');
    const [recordID, setrecordID] = useState(0);

    const [selectedRow, setSelectedRow] = useState("0");

    const clickRow = (e) => {
        if (cMode == 'new' || cMode == 'edit')
            setSelectedRow(e);
    }

    const insertRow = (e) => {
        if (!_validateLine(e)) return;

        let newLine = { ...poDet };
        let x = parseFloat(parseFloat(Object.keys(newLine)[Object.keys(newLine).length - 1]) + 1);
        initialPODet.id = x;
        newLine[x] = initialPODet;
        setPODet(newLine);
        setSelectedRow(x);
    }

    const setLineItem = (e) => {

        let fieldRow = e.target.id.replace(e.target.name, "");
        let newLine = { ...poDet };

        switch (e.target.name) {
            case 'item':
                newLine[fieldRow][e.target.name] = e.target.value;
                break;
            case 'quantity':
            case 'purchaseprice':
            case 'discount':
            case 'value':
            case 'tax':
                let regex = /^\d*[.]?\d*$/;
                if (e.target.value === "" || regex.test(e.target.value))
                    newLine[fieldRow][e.target.name] = e.target.value || 0;
                break;
            default:
                break;
        }
        setCount(count + 1);
        setPODet(newLine)
    }

    const _calc = () => {
        console.log('poDet', JSON.stringify(poDet));

        let totaltax = 0, totaldiscount = 0, total = 0;

        let calcPODet = { ...poDet }
        for (let i = 0; i < Object.keys(calcPODet).length; i++) {
            const elem = Object.keys(calcPODet)[i];
            // alert(JSON.stringify(calcPODet[elem]))

            let id = calcPODet[elem].id;
            let qty = parseFloat(calcPODet[elem].quantity) || 0;
            let purchaseprice = parseFloat(calcPODet[elem].purchaseprice) || 0;
            let subtotal = (qty * purchaseprice);
            let discount = parseFloat(calcPODet[elem].discount) || 0;
            let subtotalwithdiscount = subtotal - discount;
            let tax = parseFloat(calcPODet[elem].tax) || 0;
            let taxvalue = tax ? (tax / 100 * subtotalwithdiscount) : 0
            let grossamount = subtotalwithdiscount + taxvalue;

            calcPODet[id] = {
                "id": calcPODet[elem].id,
                "item": calcPODet[elem].item,
                "quantity": qty,
                "purchaseprice": purchaseprice,
                "discount": discount,
                "value": subtotalwithdiscount,
                "tax": tax,
                "grossamount": grossamount
            }

            totaltax += taxvalue;
            totaldiscount += discount;
            total += subtotal;

            setPODet(calcPODet);
        }

        setTotals({
            totaldiscount: totaldiscount,
            totaltax: totaltax,
            subtotal: total,
            total: total - totaldiscount + totaltax
        })

    }

    useEffect(() => {
        _calc()
    }, [count])

    useEffect(() => {
        setTimeout(() => {
            setLineValidateMsg('')
        }, 4000);
    }, [lineValidateMsg])

    const _validateLine = () => {

        let lineObj = Object.keys(poDet);

        for (let i = 0; i < lineObj.length; i++) {
            const row = lineObj[i];

            if (!poDet[row].item || !poDet[row].quantity || !poDet[row].purchaseprice) {

                if (!poDet[row].purchaseprice) setLineValidateMsg("Invalid purchaseprice");
                if (!poDet[row].quantity) setLineValidateMsg("Invalid quantity");
                if (!poDet[row].item) setLineValidateMsg("Invalid item");

                return false;
            }
        }
        return true;
    }

    const removeRow = (e) => {
        let newLine = { ...poDet };
        delete newLine[e];

        if (JSON.stringify(newLine) === JSON.stringify({}))
            setPODet({ 1: initialPODet })
        else
            setPODet(newLine);

        setCount(count + 1);
    }

    const getPO = async (poID) => {
        if (poID) {
            let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
            };
            let res = await fetch(`${APIs.po.get}/${poID}`, requestOptions);
            let response = await res.json();

            if (response.code == 'ok') {
                setPOHed(response.data.pohed);
                console.log('response.data.podet', JSON.stringify(response.data.podet))
                console.log('response.data.pohed', JSON.stringify(response.data.pohed))
                setPODet(response.data.podet);
            }
        } else {
            setPOHed(initialPOHed);
            setPODet({ 1: initialPODet });
        }
    }

    const dataPrev = async () => {
        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        let res = await fetch(`${APIs.po.prev}/${match.params.id}`, requestOptions);

        let response = await res.json();
        if (response.code === "ok" && response.result.previd) updatePath(response.result.previd);

    }

    const dataNext = async () => {
        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        let res = await fetch(`${APIs.po.next}/${match.params.id}`, requestOptions);
        let response = await res.json();
        if (response.code === "ok" && response.result.nextid) updatePath(response.result.nextid);

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
        let res = await fetch(`${APIs.po.delete}/${match.params.id}`, requestOptions);
        let response = await res.json();


        showMessage('Confirmation', response.message, 'danger');

        if (response.code === "ok") {
            history.push('/list/po');
            // history.go(0);
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
                    <button type="button" onClick={() => getPO(match.params.id)} className="btn btn-light tool-bar-list">Reset</button>
                </>);

                break;
            case 'edit':
                setCurrMode('edit-mode');
                setIsDisabled(false);
                setToolBar(<>
                    <button type="submit" className="btn btn-primary">Save</button>
                    <Link to={`/purchasing/po/${match.params.id}`}><button type="button" className="btn btn-light">Cancel</button></Link>
                    <img src={Divider} className="divider" />
                    <button type="button" onClick={() => getPO(match.params.id)} className="btn btn-light tool-bar-list">Reset</button>
                </>);
                break;
            case 'view':
                setCurrMode('view-mode');
                setIsDisabled(true);
                setToolBar(<>
                    <Link to={`/purchasing/po/${match.params.id}/e`}><button type="button" className="btn btn-primary">Edit</button></Link>
                    <Link to="/"> <button type="button" className="btn btn-light">Back</button></Link>
                    <img src={Divider} className="divider" />
                    <button type="button" onClick={dataDelete} className="btn btn-light tool-bar-list"><FontAwesomeIcon icon={faTrash} /></button>
                    <Link to={`/print/purchasing/po/${match.params.id}`}><button type="button" className="btn btn-light mr-1"><FontAwesomeIcon icon={faPrint} /> </button></Link>
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

        getPO(match.params.id);
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

    useEffect(() => {
        _getStates();
    }, [])

    const onSubmit = (e) => {

        e.preventDefault();
        if (!validateEntries())
            return false;

        let isSaved = saveData();

        // API Call

        // let isSaved = await saveData();
        // if (isSaved) history.push(`/purchasing/po/${match.params.id}`);

    }

    const _getRef = async () => {
        return await 'PO/0022'
    }

    const handleChange = (e) => {

        //  alert(e.target.value)

        console.log('e', e)

        const newPOHed = { ...poHed };

        console.log('newPOHed', newPOHed);

        if (e.target) {
            switch (e.target.value) {
                default:
                    newPOHed[e.target.name] = e.target.value;
                    break;
            }
        }
        setPOHed(newPOHed);
    }

    const validateEntries = () => {

        // if (!user.firstname) {
        //     showMessage('Validation', 'Invalid First Name', 'danger')
        //     return false;
        // }

        // if (!user.lastname) {
        //     showMessage('Validation', 'Invalid Last Name', 'danger')
        //     return false;
        // }

        // if (!user.email) {
        //     showMessage('Validation', 'Invalid Email Address', 'danger')
        //     return false;
        // }

        // if (!user.password) {
        //     showMessage('Validation', 'Invalid Password', 'danger')
        //     return false;
        // }

        // if (user.password !== confirmPwd) {
        //     showMessage('Validation', 'Passwords didn\'t match. Try again.', 'danger')
        //     return false;
        // }

        const validPODet = { ...poDet };

        let arrDet = Object.keys(validPODet);

        for (let i = 0; i < arrDet.length; i++) {
            if (!(validPODet[arrDet[i]].item && validPODet[arrDet[i]].quantity && validPODet[arrDet[i]].purchaseprice)) {
                delete validPODet[arrDet[i]];
            }
        }

        if (!Object.keys(validPODet).length) {
            showMessage('Validation', 'Invalid Items', 'danger')
            return false;
        }

        setPODet(validPODet);

        return true;

    }


    const saveData = async () => {

        console.log('poHed poHed', JSON.stringify(poHed))
        let validPOHed;
        let url, method, body;
        switch (cMode) {
            case 'new':
                url = `${APIs.po.create}`;
                method = 'POST';
                validPOHed = { ...poHed };
                validPOHed.refno = await _getRef();
                setPOHed(validPOHed);
                break;
            case 'edit':
                url = `${APIs.po.edit}/${match.params.id}`;
                method = 'PUT';
                let objPO = {};
                objPO.poHed = delete poHed['recordid'];
                objPO.poDet = delete poDet['recordid'];
                setPOHed(objPO.poHed);
                setPODet(objPO.poDet);
                break;
            default:
                break;
        }

        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;

        let validPODet = { ...poDet };
        let arrDet = Object.keys(validPODet);
        for (let i = 0; i < arrDet.length; i++) {
            if (!(validPODet[arrDet[i]].item && validPODet[arrDet[i]].quantity && validPODet[arrDet[i]].purchaseprice)) {
                delete validPODet[arrDet[i]];
            }
        }

        const requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
            body: JSON.stringify({
                poHed: validPOHed || poHed,
                poDet: validPODet
            })
        };

        const response = await fetch(url, requestOptions);
        const data = await response.json();
        console.log('data', data);

        if (data.code === 'ok') {
            showMessage('Confirmation', data.message, 'success')
            history.push(`/purchasing/po/${match.params.id || data.recordid}`);
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
        }, 5000);
    }

    return (
        <main className="content">
            <div className="container-fluid">
                <Header currPage={currPage} />
                <form id="user-form" onSubmit={onSubmit}>
                    <div className="row">
                        <div className="col-md-3 col-xl-2">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">Purchase Tabs</h5>
                                </div>
                                <div className="list-group list-group-flush" role="tablist">
                                    <a className="list-group-item list-group-item-action active" data-toggle="list" href="#general" role="tab"> General </a>
                                    <a className="list-group-item list-group-item-action" data-toggle="list" href="#delivery" role="tab"> Delivery </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-9 col-xl-10">
                            <div className="tab-content">
                                <div className="" id="" role="tabpanel">
                                    <div className="card">
                                        <div className="card-header">
                                            <MessageBox msgShow={msgShow} msgClass={msgClass} msgTitle={msgTitle} msgContent={msgContent} />
                                            <ModalPopup modalShow={modalShow} modalClose={() => setModalShow(false)} confirmValue={setConfirmValue} modalHeading={modalHeading} modalContent={modalContent} />
                                            <div className="card-actions tool-bar">
                                                {toolBar}
                                                <div className=" float-right ">
                                                    <a onClick={dataPrev} hidden={!isDisabled} className="mr-1 tool-bar-list"> <FontAwesomeIcon className="align-middle" icon={faArrowLeft} /> </a>
                                                    <a onClick={dataNext} hidden={!isDisabled} className="mr-1 tool-bar-list"> <FontAwesomeIcon className="align-middle" icon={faArrowRight} /> </a>
                                                    <Link to="/list/po" className="tool-bar-list">List</Link>
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
                                            <h5 className="card-title mb-0">Document Number</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="refno">Ref No</label>
                                                    <input type="text" className={`form-control view-mode`} disabled="true" id="refno" name="refno" value={poHed.refno ? poHed.refno : 'To be generated...'} />
                                                    <label id="validation-required-error" className="error jquery-validation-error small form-text invalid-feedback" htmlFor="validation-required">This field is required.</label>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="manualref">Manual Ref</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="manualref" name="manualref" value={poHed.manualref} onChange={handleChange} />
                                                    <label id="validation-required-error" className="error jquery-validation-error small form-text invalid-feedback" htmlFor="validation-required">This field is required.</label>
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="trandate">Date</label>
                                                    <DateSelect className={`form-control ${currMode}`} disabled={isDisabled} id="trandate" name="trandate" selected={poHed.trandate ? new Date(poHed.trandate) : null} onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade show active" id="general" role="tabpanel">
                                    <div className="card">
                                        <div className="card-header">
                                            <h5 className="card-title mb-0">General info</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="form-row">
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="currency">Currency</label>
                                                    <CurrencySelect className={`form-control ${currMode}`} disabled={isDisabled} id="currency" name="currency" value={poHed.currency} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="exchangerate">Exchange Rate</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="exchangerate" name="exchangerate" value={poHed.exchangerate} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="potype">PO Type</label>
                                                    <POTypeSelect className={`form-control ${currMode}`} disabled={isDisabled} id="potype" name="potype" value={poHed.potype} onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-row d-none">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="tax">Tax</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="tax" name="tax" onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="lastname">Cost Center</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="lastname" name="lastname" onChange={handleChange} />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="supplier">Supplier</label>
                                                    <SupplierSelect type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="supplier" name="supplier" value={poHed.supplier} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="location">Location</label>
                                                    <LocationSelect className={`form-control ${currMode}`} disabled={isDisabled} id="location" name="location" value={poHed.location} onChange={handleChange} currMode={currMode} />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="memo">Memo</label>
                                                    <textarea rows="2" className={`form-control ${currMode}`} disabled={isDisabled} id="memo" name="memo" value={poHed.memo} onChange={handleChange}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade" id="delivery" role="tabpanel">
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
                                            <h5 className="card-title mb-0">Delivery</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="form-group">

                                                <label htmlFor="contactperson">Contact Person</label>
                                                <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="contactperson" name="contactperson" value={poHed.contactperson} onChange={handleChange} />
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="addr1">Address Line 1</label>
                                                <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="addr1" name="addr1" value={poHed.addr1} onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="addr2">Address Line 2</label>
                                                <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="addr2" name="addr2" value={poHed.addr2} onChange={handleChange} />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="city">City</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="city" name="city" value={poHed.city} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label htmlFor="state">State</label>
                                                    <StateSelect id="state" name="state" className={`form-control ${currMode}`} disabled={isDisabled} value={poHed.state} onChange={handleChange} />

                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label htmlFor="zip">Zip</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="zip" name="zip" value={poHed.zip} onChange={handleChange} />
                                                </div>
                                            </div>

                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="expdeldate">Expected Delivery Date</label>
                                                    <DateSelect className={`form-control ${currMode}`} disabled={isDisabled} id="expdeldate" name="expdeldate" selected={poHed.expdeldate ? new Date(poHed.expdeldate) : null} onChange={handleChange} />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="contactnumber">Contact Number</label>
                                                    <input type="text" className={`form-control ${currMode}`} disabled={isDisabled} id="contactnumber" name="contactnumber" value={poHed.contactnumber} onChange={handleChange} />
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card col-md-12 col-xl-12">
                            <div className="card-header"><h5 className="card-title">Purchase Items</h5>
                                <h6 class="card-subtitle text-validate" style={{ color: 'red' }}>{lineValidateMsg}</h6>
                            </div>
                            <table className="table form-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "2%" }}>Seq</th>
                                        <th style={{ width: "30%" }}>Item</th>
                                        <th style={{ width: "10%" }}>Quantity</th>
                                        <th style={{ width: "10%" }}>Purchase Price</th>
                                        <th style={{ width: "10%" }}>Discount</th>
                                        <th style={{ width: "10%" }}>Amount</th>
                                        <th style={{ width: "10%" }}>Tax</th>
                                        <th style={{ width: "10%" }}>Gross Amount</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(poDet).map((row, idx) => (
                                        <PurchaseOrderItem lineNo={idx + 1} clickRow={clickRow} selectedRow={selectedRow}
                                            insertRow={insertRow} removeRow={removeRow} row={poDet[row]} setLineItem={setLineItem} currMode={currMode} key={idx + 1}
                                            isDisabled={isDisabled} />
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="2" className={currMode == 'view-mode' ? 'd-none' : ''}>
                                            <button className="btn btn-default" type="button" onClick={insertRow}><FontAwesomeIcon icon={faPlus} style={{ color: "red123" }} /> Insert</button>
                                        </td>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>

                    </div>

                    <div class="row" >
                        <div className="card col-md-4 col-xl-4">
                            <div className="card-header"><h5 className="card-title">Summary</h5>
                                <h6 class="card-subtitle text-validate" style={{ color: 'red' }}>{lineValidateMsg}</h6>
                            </div>
                            <table class="table table-sm">
                                <tbody>
                                    <tr>
                                        <td>Subtotal </td>
                                        <td class="text-right">${totals.subtotal}</td>
                                    </tr>
                                    <tr>
                                        <td>Total Discount </td>
                                        <td class="text-right">${totals.totaldiscount}</td>
                                    </tr>
                                    <tr>
                                        <td>Tax Total </td>
                                        <td class="text-right">{totals.totaltax}</td>
                                    </tr>
                                    <tr>
                                        <th>Total </th>
                                        <th class="text-right">${totals.total}</th>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="card-header"></div>
                        </div>
                    </div>
                </form>
            </div >
        </main >
    )
}

function PurchaseOrderItem({ lineNo, clickRow, selectedRow, insertRow, removeRow, row, setLineItem, currMode, isDisabled }) {

    const [items, setItems] = useState([])

    const _getItems = () => {
        let itemList = [
            { value: "1", text: "Item 1" },
            { value: "2", text: "Item 2" },
            { value: "3", text: "Item 3" },
            { value: "4", text: "Item 4" }
        ]
        setItems(itemList);
    }

    useEffect(() => {
        _getItems();
    }, [])


    return (
        <>
            <tr key={row.id} onClick={() => clickRow(row.id)} >
                <td>{lineNo}</td>
                <td><ItemSelect id={`item${row.id}`} className={`form-control ${currMode}`} disabled={isDisabled} lineno={row.id} name="item" value={row.item} onChange={setLineItem} /></td>
                <td><input type="text" id={`quantity${row.id}`} className={`form-control ${currMode}`} disabled={isDisabled} lineno={row.id} name="quantity" value={row.quantity} onChange={setLineItem} /></td>
                <td><input type="text" id={`purchaseprice${row.id}`} className={`form-control ${currMode}`} disabled={isDisabled} lineno={row.id} name="purchaseprice" value={row.purchaseprice} onChange={setLineItem} /></td>
                <td><input type="text" id={`discount${row.id}`} className={`form-control ${currMode}`} disabled={isDisabled} lineno={row.id} name="discount" value={row.discount} onChange={setLineItem} /></td>
                <td><input type="text" id={`value${row.id}`} className={`form-control ${currMode}`} disabled="true" lineno={row.id} name="value" value={row.value} onChange={setLineItem} /></td>
                <td><input type="text" id={`tax${row.id}`} className={`form-control ${currMode}`} disabled={isDisabled} lineno={row.id} name="tax" value={row.tax} onChange={setLineItem} /></td>
                <td><input type="text" className={`form-control ${currMode}`} disabled="true" value={row.grossamount} /></td>
                <td className={selectedRow === row.id ? "" : "d-none"} hidden={isDisabled}><button type="button" className="btn btn-default" onClick={() => removeRow(row.id)}><FontAwesomeIcon icon={faTimes} style={{ color: "red" }} /></button></td>
            </tr>
        </>
    )
}

