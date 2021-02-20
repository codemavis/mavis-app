import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap';

export default function ModalPopup({ modalShow, modalClose, confirmValue, modalHeading, modalContent }) {
    return (
        <>
            <Modal show={modalShow} onHide={() => modalClose(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalHeading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalContent}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { confirmValue(false); modalClose(false); }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => { confirmValue(true); modalClose(false); }}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
