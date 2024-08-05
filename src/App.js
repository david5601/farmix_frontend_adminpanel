/*!
=========================================================
* Muse Ant Design Dashboard - v1.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Configure from "./pages/Configure";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import DepositHistory from "./pages/Deposit";
import Tasks from "./pages/Tasks";
import Withdraw from "./pages/Withdraw";
import { useEffect } from "react";
import Wallet from "./pages/Wallet"
function App() {

  useEffect(() => {
       
  }, [])
  

  return (
    <div className="App">
      <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/register" exact component={SignUp} />
        <Main>
          <Route exact path="/users" component={Home} />
          <Route exact path="/deposit" component={DepositHistory} />
          <Route exact path="/task" component={Tasks} />
          <Route exact path="/withdraw" component={Withdraw} />
          <Route exact path="/configure" component={Configure} />
          {/* <Route exact path="/wallet" component={Wallet} /> */}
        </Main>
      </Switch>
    </div>
  );
}

export default App;
