import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default function DateSelect({ className, disabled, id, name, selected, onChange }) {

    const handleChange = (date) => {
        onChange({
            target: {
                value: date? date.toISOString().substring(0, 10): (null),
                name: name,
                id: id
            }
        });
    }

    return (
        <>
            <DatePicker dateFormat="yyyy-MM-dd" className={className} disabled={disabled} id={id} name={name} selected={selected} onChange={handleChange} />
        </>
    )
}
