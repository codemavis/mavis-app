import React from 'react'
import Header from './Header'

export default function MainContent() {
    return (
        <main className="content">
            <div className="container-fluid">

                <Header/>

                <div className="row">
                    <div className="col-md-9 col-xl-12">
                        <div className="tab-content">
                            <div className="tab-pane fade show active" id="account" role="tabpanel">
                                <div className="card">
                                    <div className="card-header">
                                        <div className="card-actions float-right">
                                            <a href="#" className="mr-1">
                                                <i className="align-middle" data-feather="refresh-cw"></i>
                                            </a>
                                            <div className="d-inline-block dropdown show">
                                                <a href="#" data-toggle="dropdown" data-display="static">
                                                    <i className="align-middle" data-feather="more-vertical"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <a className="dropdown-item" href="#">Action</a>
                                                    <a className="dropdown-item" href="#">Another action</a>
                                                    <a className="dropdown-item" href="#">Something else here</a>
                                                </div>
                                            </div>
                                        </div>
                                        <h5 className="card-title mb-0">Private info</h5>
                                    </div>
                                    <div className="card-body">
                                        <form>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label for="inputFirstName">First name</label>
                                                    <input type="text" className="form-control" id="inputFirstName" placeholder="First name" />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label for="inputLastName">Last name</label>
                                                    <input type="text" className="form-control" id="inputLastName" placeholder="Last name" />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label for="inputEmail4">Email</label>
                                                <input type="email" className="form-control" id="inputEmail4" placeholder="Email" />
                                            </div>
                                            <div className="form-group">
                                                <label for="inputAddress">Address</label>
                                                <input type="text" className="form-control" id="inputAddress" placeholder="1234 Main St" />
                                            </div>
                                            <div className="form-group">
                                                <label for="inputAddress2">Address 2</label>
                                                <input type="text" className="form-control" id="inputAddress2" placeholder="Apartment, studio, or floor" />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label for="inputCity">City</label>
                                                    <input type="text" className="form-control" id="inputCity" />
                                                </div>
                                                <div className="form-group col-md-4">
                                                    <label for="inputState">State</label>
                                                    <select id="inputState" className="form-control">
                                                        <option selected>Choose...</option>
                                                        <option>...</option>
                                                    </select>
                                                </div>
                                                <div className="form-group col-md-2">
                                                    <label for="inputZip">Zip</label>
                                                    <input type="text" className="form-control" id="inputZip" />
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary">Save changes</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
