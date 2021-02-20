import React from 'react'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container-fluid">
                <div className="row text-muted">
                    <div className="col-8 text-left">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <a className="text-muted" href="#">Support</a>
                            </li>
                            <li className="list-inline-item">
                                <a className="text-muted" href="#">Privacy</a>
                            </li>
                            <li className="list-inline-item">
                                <a className="text-muted" href="#">Terms of Service</a>
                            </li>
                            <li className="list-inline-item">
                                <a className="text-muted" href="#">Contact</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-4 text-right">
                        <p className="mb-0">
                            &copy; 2021 - <a href="dashboard-default.html" className="text-muted">Mavis</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>

    )
}
