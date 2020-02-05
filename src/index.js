import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";

import { store, history } from "./store";

import HeaderContainer from "./commons/containers/header";
import LoginContainer from "./loginScreen/containers/login";
import ValidateContainer from "./validateScreen/containers/validate";
import ResetContainer from "./resetScreen/containers/reset";
import UserContainer from "./userScreen/containers/user";
import MapContainer from "./mapScreen/containers/map";
import RootContainer from "./rootScreen/containers/root";
import ToastContainer from "./commons/containers/toast";

import "./index.css";
import "./commons/styles/commons.css";

window.addEventListener(
  "dragover",
  event => {
    event.preventDefault();
    event.dataTransfer.effectAllowed = "none";
  },
  false
);

window.addEventListener(
  "drop",
  event => {
    event.preventDefault();
    event.dataTransfer.effectAllowed = "none";
  },
  false
);

render(
  <Provider store={store}>
    <HeaderContainer />
    <div className="App">
      <Router history={history}>
        <Switch>
          <Route exact path="/login" component={LoginContainer} />
          <Route
            exact
            path="/validate/:type/:token"
            component={ValidateContainer}
          />
          <Route exact path="/reset/:cipher" component={ResetContainer} />
          <Route exact path="/user" component={UserContainer} />
          <Route exact path="/map" component={MapContainer} />
          <Route exact path="/" component={RootContainer} />
        </Switch>
      </Router>
    </div>
    <ToastContainer />
  </Provider>,
  document.getElementById("root")
);
