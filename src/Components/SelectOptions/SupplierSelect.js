import React, { useState, useEffect, useRef } from 'react';
import CustomSelect from 'react-select';
import { APIs } from '../Common/APIs';

export default function SupplierSelect({ className, disabled, id, name, value, onChange }) {

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
        // let response = await fetch(APIs.supplier.get, requestOptions);
        // let res = await response.json();
        // console.log('res', JSON.stringify(res));

        let res = {
            code: 'ok',
            data: [
                { "Record ID": 1, "Name": "Sachie Leonard" },
                { "Record ID": 2, "Name": "Leda Jakov" },
                { "Record ID": 3, "Name": "Mukhamed Markos" },
                { "Record ID": 4, "Name": "Inka Kisecawchuck" },
                { "Record ID": 5, "Name": "Marie Archie" },
                { "Record ID": 6, "Name": "Albin Portia" },
                { "Record ID": 7, "Name": "Josceline Jason" },
                { "Record ID": 8, "Name": "Gopinath Anant" }
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
        onChange({ target: { value: e.value, name: name } })
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
            <CustomSelect ref={txtsearch} id={id} name={name} disabled={disabled} value={currValue} className={vClass} options={options} onBlur={handleBlur} onChange={handleChange} />
        </>
    )
}