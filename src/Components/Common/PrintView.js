import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrtUserManager from '../Reports/Admin/PrtUserManager';
import "../../App.css";
import { Link } from 'react-router-dom';
import Header from './Header';
import { getRecordDetails } from './Utils';

export default function PrintView({ match }) {

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const currPage = getRecordDetails(match.params.record) || {};
    currPage.pageType = 'Report'
    
    return (
        <div>
            <main className="content">
                <div className="container-fluid">
                    <Header currPage={currPage} />
                    <div className="row">
                        <div className="col-12">

                            <div className="card">


                                <div className="card-body m-sm-3 m-md-5">
                                    <div className="tool-bar">
                                        <a onClick={handlePrint} className="btn btn-primary"> Print this report </a>
                                        <Link to={`/${match.params.path}/${match.params.record}/${match.params.id}`} className="btn btn-light"> Go to record </Link>
                                    </div>
                                    <PrtUserManager ref={componentRef} recordid={match.params.id} />

                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>

    )
}
