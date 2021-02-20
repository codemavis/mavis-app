import React, { useState, useEffect } from 'react'

export default function AddSelect({ options }) {

    return (
        options.map((option, idx) => (
            <option key={idx} value={option.value}>{option.text}</option>
        ))
    )
}
