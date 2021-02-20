import React, { useState, useEffect } from 'react'

export default function GetReference({ recordType, value, onChange }) {

    const [refNo, setRefNo] = useState('')

    useEffect(() => {
        switch (recordType) {
            case 'po':
                setRefNo('24545454')
                break;

            default:
                break;
        }
    }, [recordType])

    const handleChange = (e) => {
        onChange({
            value: refNo,
            name: e.target.name,
            id: e.target.id
        })
    }

    return (
        <>
            <input type="text" className="form-control view-mode" disabled="true" id="refno" name="refno" value={value ? value : 'To be generated...'} />
        </>
    )
}
