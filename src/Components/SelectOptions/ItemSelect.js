import React, { useState, useEffect, useRef } from 'react';
import CustomSelect from 'react-select';
import { APIs } from '../Common/APIs';

export default function ItemSelect({ className, disabled, id, name, value, onChange, lineno }) {

    const [options, setOptions] = useState([]);
    const [currValue, setCurrValue] = useState('')
    const [vClass, setVClass] = useState('d-none')
    const [cVisible, setCVisible] = useState('')

    const txtsearch = useRef(null);

    const getOptions = async () => {

        let authToken = JSON.parse(localStorage.getItem('token')).accessToken;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` }
        };
        // let response = await fetch(APIs.currency.get, requestOptions);
        // let res = await response.json();
        // console.log('res', JSON.stringify(res));

        let res = {
            code: 'ok',
            data: [
                { "Record ID": "1", Name: "Item 1" },
                { "Record ID": "2", Name: "Item 2" },
                { "Record ID": "3", Name: "Item 3" },
                { "Record ID": "4", Name: "Item 4" }
            ]
        }

        let opt = [{ value: '', label: 'Choose...' }]
        if (res.code == 'ok') {
            res.data.map((data) => {
                opt.push({ value: data["Record ID"], label: data["Name"] });
            })
        }
        setOptions(opt)

    }

    useEffect(() => {
        getOptions()
    }, [])

    useEffect(() => {
        let arrCurr = options.filter((e) => e.value == value)
        if (arrCurr.length) setCurrValue(arrCurr[0])
    })

    const handleClick = () => {
        setVClass('')
        setCVisible('d-none')
    }
    const handleBlur = () => {
        setVClass('d-none');
        setCVisible('')
    }

    const handleChange = (e) => {
        onChange({ target: { value: e.value, name: name, id: id } })
    }

    useEffect(() => {
        txtsearch.current.focus();
    }, [vClass])

    useEffect(() => {
        setVClass('d-none');
        setCVisible('')
    }, [value])

    return (
        <>
            <input type="text" value={currValue.label} disabled={disabled} className={className + ' ' + cVisible} onFocus={handleClick} />
            <CustomSelect ref={txtsearch} id={id} name={name} lineno={lineno} disabled={disabled} value={currValue} className={vClass} options={options} onBlur={handleBlur} onChange={handleChange} />
        </>
    )
}
