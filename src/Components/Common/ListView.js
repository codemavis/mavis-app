import React, { useEffect, useState } from 'react'
import { useLocation, useHistory, Link } from 'react-router-dom';
import Header from './Header';
import { getRecordDetails } from '../Common/Utils';
import $ from 'jquery';
import "datatables.net-dt"
import "datatables.net-buttons"
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-buttons/js/dataTables.buttons';


export default function ListView({ match }) {

    const location = useLocation();
    const history = useHistory();

    const [recordList, setRecordList] = useState([]);

    console.log('location', location.pathname);
    console.log('match', match.params.record);

    let currPage = getRecordDetails(match.params.record) || {};

    currPage.list = 'List';

    console.log('currPage', currPage);

    const _getRecordData = async (recordType) => {

        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        let res = await fetch(`http://localhost:5000/${match.params.record}`, requestOptions);
        let response = await res.json();

        console.log('response', response);

        return response;
    }

    useEffect(async () => {
        let list = await _getRecordData();
        setRecordList(list);
    }, [])

    return (
        <main className="content">
            <div className="container-fluid">
                <Header currPage={currPage} />
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title">List View</h5>
                            </div>
                            <div className="card-body">
                                <ListViewTable recordList={recordList} currPage={currPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}



function ListViewTable({ recordList, currPage }) {

    useEffect(() => {
        $('#datatables-basic').DataTable({
            responsive: true
        });
        // Datatables with Buttons
        var datatablesButtons = $('#datatables-buttons').DataTable({
            lengthChange: !1,
            buttons: ["copy", "print"],
            responsive: true
        });
        datatablesButtons.buttons().container().appendTo("#datatables-buttons_wrapper .col-md-6:eq(0)")

    }, [ $('#datatables-basic')])


    let rowHead, tableHead;

    if (recordList.length > 0) {
        rowHead = Object.keys(recordList[0])
        console.log('rowHead', rowHead);
        tableHead = <TableHead rowHead={rowHead} />
    }
    else
        return <div>No records found</div>

    return (
        <table id="datatables-basic" className="table table-striped list-view-table" style={{ width: '100%' }}>
            <thead>
                <tr>{tableHead}</tr>
            </thead>
            <tbody>
                {
                    recordList.map((row) => (
                        <tr>
                            {
                                rowHead.map((val, idx) => (
                                    <TableRow row={row} val={val} idx={idx} currPage={currPage} />

                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
            <tfoot>
                <tr>{tableHead}</tr>
            </tfoot>
        </table>
    )
}

function TableHead({ rowHead }) {
    return (
        rowHead.map((head) => (
            <th>{head}</th>
        ))
    )
}

function TableRow({ val, row, idx, currPage }) {
    return (
        <td>
            {
                (idx === 1) ? <Link to={`${currPage.pathName}/${row["Record ID"]}`}>{row[val]}</Link> : row[val]
            }
        </td>
    )
}
