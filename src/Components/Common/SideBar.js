import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../../Images/avatars/avatar.jpg';
import { getSideList } from '../Common/Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getRecordDetails } from '../Common/Utils';

export default function SideBar() {

    const history = useHistory();

    const [child, setChild] = useState('');
    const [item, setItem] = useState('')
    const [sideList, setSideList] = useState([])

    const itemClick = (item) => { setItem(item); }
    const childClick = (child) => { setChild(child); }
    const updSideBar = () => { setSideList(getSideList()); }

    useEffect(() => { updSideBar(); }, []);

    useEffect(() => {
        let pathArr = history.location.pathname && history.location.pathname.split('/');
        if (pathArr[1] === 'list' && pathArr[2]) {
            let recDetails = getRecordDetails(pathArr[2]);
            pathArr = recDetails && recDetails.pathName.split('/') || pathArr;
        }
        setItem(pathArr[1] !== 'list' ? pathArr[1] : '');
        setChild(pathArr[2] || '');
    }, [])

    return (
        <nav id="sidebar" className="sidebar">

            <Link className="sidebar-brand" to="/"><FontAwesomeIcon icon="star" size="lg" /> Mavis </Link>
            <div className="sidebar-content">
                <div className="sidebar-user">
                    <img src={Avatar} className="img-fluid rounded-circle mb-2" alt="Sathasivam Sujee" />
                    <div className="font-weight-bold">Sathasivam Sujee</div>
                    <small>Full-stack Developer</small>
                </div>
                <ul className="sidebar-nav ">
                    {
                        sideList.map((list, idx) => (
                            <SideBarHead list={list} key={`h${idx.toString()}`} itemClick={itemClick} childClick={childClick} child={child} item={item} />
                        ))
                    }
                </ul>
            </div>
        </nav>
    )
}

function SideBarHead({ list, itemClick, childClick, child, item }) {
    return (
        <>
            <li className="sidebar-header"> {list.text} </li>
            {
                list.items.map((listItems, idx) => (
                    <SideBarMenu listItems={listItems} key={list.val + idx} itemClick={itemClick} childClick={childClick} child={child} item={item} />
                ))
            }
        </>
    )
}

function SideBarMenu({ listItems, itemClick, childClick, child, item }) {
    return (
        <li className={`sidebar-item  ${listItems.val == item ? 'active' : ''}`} onClick={() => itemClick(listItems.val)}>
            <a href={`#${listItems.val}`} data-toggle="collapse" className="sidebar-link collapsed">
                <FontAwesomeIcon icon={listItems.icon} /> <span className="align-middle"> {listItems.text}</span>
            </a>
            <ul id={listItems.val} className={`sidebar-dropdown list-unstyled collapse ${listItems.val == item ? '' : ''}`} data-parent="#sidebar">
                {
                    listItems.items.map((listChild, idx) => (
                        <SideBarList listChild={listChild} parent={listItems.val} idx={idx} key={`l${idx}`} childClick={childClick} child={child} />
                    ))
                }
            </ul>
        </li>
    )
}

function SideBarList({ listChild, parent, childClick, child }) {
    return (
        <li className={`sidebar-item ${child == listChild.val ? 'active' : ''}`} onClick={() => childClick(listChild.val)}>
            <Link className="sidebar-link" to={`/${parent}/${listChild.val}`}>{listChild.text}</Link>
        </li>
    )
}