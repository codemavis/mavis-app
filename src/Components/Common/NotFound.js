import React from 'react'

export default function NotFound() {
    return (
        <main className="main h-100 w-100">
            <div className="container h-100">
                <div className="row h-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">
                            <div className="text-center">
                                <h1 className="display-1 font-weight-bold">404</h1>
                                <p className="h1">Page not found.</p>
                                <p className="h2 font-weight-normal mt-3 mb-4">The page you are looking for might have been removed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
