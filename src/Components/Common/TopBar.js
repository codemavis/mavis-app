import React from 'react'
import { Link, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelopeOpen, faBell, faCog, faBuilding, faBellSlash, faComment, faUser, faChartPie, faCogs, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { logout } from '../Common/Utils';

export default function TopBar() {

    const history = useHistory();

    const signOut = async () => {
        if (await logout()) {
            history.push('/');
            history.go(0);
        }
    }

    return (
        <nav className="navbar navbar-expand navbar-theme">
            <a className="sidebar-toggle d-flex mr-2">
                <i className="hamburger align-self-center"></i>
            </a>

            <form className="form-inline d-none d-sm-inline-block">
                <input className="form-control form-control-lite" type="text" placeholder="Search projects..." />
            </form>

            <div className="navbar-collapse collapse">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown active">
                        <a className="nav-link dropdown-toggle position-relative" href="#" id="messagesDropdown" data-toggle="dropdown">
                            <FontAwesomeIcon size="lg" icon={faEnvelopeOpen} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right py-0" aria-labelledby="messagesDropdown">
                            <div className="dropdown-menu-header">
                                <div className="position-relative">
                                    4 New Messages
                                    </div>
                            </div>
                            <div className="list-group">
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <img src="img/avatars/avatar-5.jpg" className="avatar img-fluid rounded-circle" alt="Michelle Bilodeau" />
                                        </div>
                                        <div className="col-10 pl-2">
                                            <div className="text-dark">Michelle Bilodeau</div>
                                            <div className="text-muted small mt-1">Nam pretium turpis et arcu. Duis arcu tortor.</div>
                                            <div className="text-muted small mt-1">5m ago</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <img src="img/avatars/avatar-3.jpg" className="avatar img-fluid rounded-circle" alt="Kathie Burton" />
                                        </div>
                                        <div className="col-10 pl-2">
                                            <div className="text-dark">Kathie Burton</div>
                                            <div className="text-muted small mt-1">Pellentesque auctor neque nec urna.</div>
                                            <div className="text-muted small mt-1">30m ago</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <img src="img/avatars/avatar-2.jpg" className="avatar img-fluid rounded-circle" alt="Alexander Groves" />
                                        </div>
                                        <div className="col-10 pl-2">
                                            <div className="text-dark">Alexander Groves</div>
                                            <div className="text-muted small mt-1">Curabitur ligula sapien euismod vitae.</div>
                                            <div className="text-muted small mt-1">2h ago</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <img src="img/avatars/avatar-4.jpg" className="avatar img-fluid rounded-circle" alt="Daisy Seger" />
                                        </div>
                                        <div className="col-10 pl-2">
                                            <div className="text-dark">Daisy Seger</div>
                                            <div className="text-muted small mt-1">Aenean tellus metus, bibendum sed, posuere ac, mattis non.</div>
                                            <div className="text-muted small mt-1">5h ago</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="dropdown-menu-footer">
                                <a href="#" className="text-muted">Show all messages</a>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown ml-lg-2">
                        <a className="nav-link dropdown-toggle position-relative" href="#" id="alertsDropdown" data-toggle="dropdown">
                            <FontAwesomeIcon size="lg" icon={faBell} />
                            <span className="indicator"></span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right py-0" aria-labelledby="alertsDropdown">
                            <div className="dropdown-menu-header">
                                4 New Notifications
                                </div>
                            <div className="list-group">
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <FontAwesomeIcon color="red" icon={faBell} />
                                        </div>
                                        <div className="col-10">
                                            <div className="text-dark">Update completed</div>
                                            <div className="text-muted small mt-1">Restart server 12 to complete the update.</div>
                                            <div className="text-muted small mt-1">2h ago</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <FontAwesomeIcon color="orange" icon={faEnvelopeOpen} />
                                        </div>
                                        <div className="col-10">
                                            <div className="text-dark">Lorem ipsum</div>
                                            <div className="text-muted small mt-1">Aliquam ex eros, imperdiet vulputate hendrerit et.</div>
                                            <div className="text-muted small mt-1">6h ago</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <FontAwesomeIcon icon={faBuilding} />
                                        </div>
                                        <div className="col-10">
                                            <div className="text-dark">Login from 192.186.1.1</div>
                                            <div className="text-muted small mt-1">8h ago</div>
                                        </div>
                                    </div>
                                </a>
                                <a href="#" className="list-group-item">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col-2">
                                            <FontAwesomeIcon color="green" icon={faBellSlash} />
                                        </div>
                                        <div className="col-10">
                                            <div className="text-dark">New connection</div>
                                            <div className="text-muted small mt-1">Anna accepted your request.</div>
                                            <div className="text-muted small mt-1">12h ago</div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="dropdown-menu-footer">
                                <a href="#" className="text-muted">Show all notifications</a>
                            </div>
                        </div>
                    </li>
                    <li className="nav-item dropdown ml-lg-2">
                        <a className="nav-link dropdown-toggle position-relative" href="#" id="userDropdown" data-toggle="dropdown">
                            <FontAwesomeIcon size="lg" icon={faCog} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                            <a className="dropdown-item" href="#"><FontAwesomeIcon icon={faUser} />  View Profile</a>
                            <a className="dropdown-item" href="#"><FontAwesomeIcon icon={faComment} /> Contacts</a>
                            <a className="dropdown-item" href="#"><FontAwesomeIcon icon={faChartPie} /> Analytics</a>
                            <a className="dropdown-item" href="#"><FontAwesomeIcon icon={faCogs} /> Settings</a>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" onClick={signOut}><FontAwesomeIcon icon={faArrowCircleRight} /> Sign out</a>
                        </div>
                    </li>
                </ul>
            </div>

        </nav>

    )
}
