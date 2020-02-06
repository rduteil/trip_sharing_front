import { createStore, combineReducers, applyMiddleware } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";

import { combineEpics, createEpicMiddleware } from "redux-observable";
import { ajax } from "rxjs/ajax";

import HeaderReducer from "./commons/reducers/header";
import LoginReducer from "./loginScreen/reducers/login";
import ValidateReducer from "./validateScreen/reducers/validate";
import ResetReducer from "./resetScreen/reducers/reset";
import UserReducer from "./userScreen/reducers/user";
import RootReducer from "./rootScreen/reducers/root";
import MapReducer from "./mapScreen/reducers/map";
import ToastReducer from "./commons/reducers/toast";

import { loginEpic, registerEpic, getResetEpic } from "./loginScreen/actions/login";
import { validateEpic } from "./validateScreen/actions/validate";
import { setResetEpic } from "./resetScreen/actions/reset";
import { updateUserEpic, changePasswordEpic } from "./userScreen/actions/user";

const epics = combineEpics(
  loginEpic,
  registerEpic,
  getResetEpic,
  validateEpic,
  setResetEpic,
  updateUserEpic,
  changePasswordEpic
);
const epicMiddleware = createEpicMiddleware({
  dependencies: { ajax: ajax }
});

const createRouterReducer = history =>
  combineReducers({
    router: connectRouter(history),
    header: HeaderReducer,
    login: LoginReducer,
    validate: ValidateReducer,
    reset: ResetReducer,
    user: UserReducer,
    root: RootReducer,
    map: MapReducer,
    toast: ToastReducer
  });

export const history = createBrowserHistory();

export const store = createStore(
  createRouterReducer(history),
  applyMiddleware(routerMiddleware(history), epicMiddleware)
);

epicMiddleware.run(epics);
