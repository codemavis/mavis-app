import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'


export default function MessageBox({ msgShow, msgClass, msgTitle, msgContent }) {

    return (
        <div className={"mb-3 " + msgShow}>
            <div className={`alert alert-${msgClass} alert-dismissible`} role="alert">
                <div className="alert-message">
                    <h4 className="alert-heading"><FontAwesomeIcon icon={msgClass === 'success' ? faCheck : faTimes} style={{ marginRight: "0.5rem" }} size="lg" />{msgTitle}</h4>
                    <p>{msgContent}</p>
                    <hr />
                    <p className="mb-0"></p>
                </div>
                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
    )
}
