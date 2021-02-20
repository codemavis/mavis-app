import React, { useHistory, useState } from 'react'

export async function logout() {

    if (localStorage.getItem('token') && JSON.parse(localStorage.getItem('token')).refreshToken) {

        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "token": JSON.parse(localStorage.getItem('token')).refreshToken })
        };
        try {
            const response = await fetch('http://localhost:4444/logout', requestOptions);
            const data = await response.json();
            console.log('data4', data);
        } catch (error) {
            console.log('error', error.message);
        }
        localStorage.clear();
        return true;
    } else
        return false;
}

export async function updateToken() {
    let refreshToken = localStorage.getItem('token') && JSON.parse(localStorage.getItem('token')).refreshToken;

    if (refreshToken) {
        //get new token & update
        try {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: refreshToken })
            };

            const response = await fetch('http://localhost:4444/token', requestOptions);
            const data = await response.json();
            console.log('data1', data);

            if (data.code === 'OK') {
                setToken(data.accessToken, refreshToken);
                return true;
            }
        } catch (error) {
            console.log('error', error.message);
        }
    }

    return false;
}

export function setToken(accessToken, refreshToken) {
    localStorage.setItem('token', JSON.stringify({ accessToken: accessToken, refreshToken: refreshToken }));
}

export async function login(user) {
    try {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        };

        const response = await fetch('http://localhost:4444/login/', requestOptions);
        const data = await response.json();
        console.log('data2', data);

        if (data.code === 'OK') {
            setToken(data.accessToken, data.refreshToken);
            return true;
        }
        alert(data.message);

    } catch (error) {
        console.log('error', error);
    }

    return false;
}

export async function getCurretUser() {
    if (localStorage.getItem('token') && JSON.parse(localStorage.getItem('token')).accessToken) {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')).accessToken,
            },
        };
        const response = await fetch('http://localhost:5000/user/cu', requestOptions);
        const dataObj = await response.json();

        console.log('data3', dataObj);

        if (dataObj.code !== 'OK') {
            //Check and update refresh Token
            if (!await updateToken())
                return { code: 'ERROR', message: 'Refresh Token Expired, Login Again', user: null };
            else
                return await getCurretUser();
        }
        return { code: 'OK', message: 'Success', user: dataObj.user };
    }
    return { code: 'ERROR', message: 'Token Not Available in Local', user: null };
}

export function getRecordDetails(recordType) {

    //Get from db
    const recordData = {
        "user": {
            pageType: "Master Files",
            pageGroup: "Admin",
            pageName: "Users",
            recordType: "user",
            pathName: "/admin/user"
        },
        "po": {
            pageType: "Transactions",
            pageGroup: "Purchasing",
            pageName: "Purchase Orders",
            recordType: "po",
            pathName: "/purchasing/po"
        }
    }

    return recordData[recordType];

}

export function getSideList() {
    return [{ "val": "master", "text": "Master Files", "items": [{ "val": "admin", "text": "Admin", "icon": "cog", "items": [{ "val": "user", "text": "User Account" }, { "val": "role", "text": "User Roles" }, { "val": "currency", "text": "Currency" }, { "val": "prilvl", "text": "Price Level" }, { "val": "company", "text": "Company Profile" }, { "val": "location", "text": "Location" }] }, { "val": "stock", "text": "Stocks & Sales", "icon": "shopping-bag", "items": [{ "val": "group", "text": "Item Group" }, { "val": "type", "text": "Item Type" }, { "val": "unit", "text": "Unit of Measure" }, { "val": "reason", "text": "Reason" }, { "val": "item", "text": "Item" }] }, { "val": "debtor", "text": "Debtors", "icon": "users", "items": [{ "val": "salesrep", "text": "Sales Person" }, { "val": "cusgroup", "text": "Customer Group" }, { "val": "customer", "text": "Customer" }] }, { "val": "creditors", "text": "Creditors", "icon": "handshake", "items": [{ "val": "suppgroup", "text": "Supplier Group" }, { "val": "supplier", "text": "Supplier" }] }] }, { "val": "transaction", "text": "Transactions", "items": [{ "val": "purchasing", "text": "Purchasing", "icon": "cart-arrow-down", "items": [{ "val": "po", "text": "Purchase Order" }, { "val": "grn", "text": "Goods Received Note" }, { "val": "grrn", "text": "Goods Return Note" }] }, { "val": "inventory", "text": "Stock", "icon": "shopping-bag", "items": [{ "val": "transfer", "text": "Location Stock Transfer" }, { "val": "damage", "text": "Damage Stock Transfer" }, { "val": "issue", "text": "Issue Entry" }, { "val": "issuereturn", "text": "Issue Return" }, { "val": "addition", "text": "Adjustments Addition" }, { "val": "deduction", "text": "Adjustments Deductiion" }] }, { "val": "sales", "text": "Sales", "icon": "chart-line", "items": [{ "val": "quote", "text": "Quotation" }, { "val": "order", "text": "Sales Order" }, { "val": "invoice", "text": "Invoice" }, { "val": "cashsale", "text": "Cash Sale" }, { "val": "salesret", "text": "Sales Return With Invoice" }, { "val": "return", "text": "Sales Return W/O Invoice" }] }, { "val": "receivable", "text": "Accounts Receivable", "icon": "users", "items": [{ "val": "debdnote", "text": "Debit Note" }, { "val": "crddnote", "text": "Credit Note" }, { "val": "receipt", "text": "Receipt" }] }, { "val": "payable", "text": "Accounts Payable", "icon": "handshake", "items": [{ "val": "debcnote", "text": "Debit Note" }, { "val": "crdcnote", "text": "Credit Note" }, { "val": "serviceinv", "text": "Service Invoice" }, { "val": "payvoucher", "text": "Payment Voucher" }] }] }, { "val": "document", "text": "Documents", "items": [{ "val": "report", "text": "Reports", "icon": "file-invoice", "items": [{ "val": "rptpurchasing", "text": "Purchasing" }, { "val": "rptstock", "text": "Stocks" }, { "val": "rptsales", "text": "Sales" }, { "val": "rptreceivable", "text": "Accounts Receivable" }, { "val": "rptpayable", "text": "Accounts Payable" }] }, { "val": "audit", "text": "Audit Trails", "icon": "receipt", "items": [{ "val": "audpurchasing", "text": "Purchasing" }, { "val": "audstock", "text": "Stocks" }, { "val": "audsales", "text": "Sales" }, { "val": "audreceivable", "text": "Accounts Receivable" }, { "val": "audpayable", "text": "Accounts Payable" }] }] }];
}