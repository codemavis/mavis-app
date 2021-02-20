import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import SideBar from './Components/Common/SideBar';
import TopBar from './Components/Common/TopBar';
import Footer from './Components/Common/Footer';
import Home from './Components/Pages/Admin/Home';
import UserManager from './Components/Pages/Admin/UserManager';
import NotFound from './Components/Common/NotFound';
import Login from './Components/Common/Login';
import Reset from './Components/Common/Reset';
import PrivateRoute from './Components/Common/PrivateRoute';
import IdleTimerContainer from './Components/Common/IdleTimerContainer';
import ListView from './Components/Common/ListView';
import PrintView from './Components/Common/PrintView';
import PurchaseOrder from './Components/Pages/Stock/PurchaseOrder';

function App() {

  const iconList = Object.keys(Icons)
    .filter((key) => key !== 'fas' && key !== 'prefix')
    .map((icon) => Icons[icon]);

  library.add(...iconList);

  const LoginContainer = () => (
    <div className="main">
      <Route path="/login" component={Login} />
      <Route path="/reset" component={Reset} />
    </div>
  )

  const DefaultContainer = () => (
    <div className="wrapper">
      <IdleTimerContainer />
      <SideBar />
      <div className="main">
        <TopBar />
        <Switch>
          <Route path="/not-found" exact component={NotFound} />
          <PrivateRoute exact path='/' component={Home} />
          <PrivateRoute exact path='/print/:path/:record/:id' component={PrintView} />

          <PrivateRoute exact path='/admin/user/:id?/:mode?' component={UserManager} />


          <PrivateRoute exact path='/purchasing/po/:id?/:mode?' component={PurchaseOrder} />

          <PrivateRoute path="/list/:record" component={ListView} />
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </div>
  )

  return (
    <Router>
      <div className="App">
        <div className="splash active">
          <div className="splash-icon"></div>
        </div>
        <Switch>
          <Route path="/login" exact component={LoginContainer} />
          <Route path="/reset" exact component={LoginContainer} />
          <Route component={DefaultContainer} />
        </Switch>
      </div>

    </Router>
  );



}

export default App;
