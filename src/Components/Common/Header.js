import React from 'react'

export default function Header({ currPage }) {
    return (
        <div className="header">
            <h1 className="header-title"> {currPage.pageName} </h1>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><a href="/" style={{ pointerEvents: 'none' }}>{currPage.pageType}</a></li>
                    <li className="breadcrumb-item"><a href="/" style={{ pointerEvents: 'none' }}>{currPage.list ? currPage.list : currPage.pageGroup}</a></li>
                    <li className="breadcrumb-item active" aria-current="page">{currPage.pageName}</li>
                </ol>
            </nav>
        </div>
    )
}
