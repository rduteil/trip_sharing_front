import { connect } from "react-redux";

import Login from "../components/login";
import {
  loginPending,
  registerPending,
  getResetPending
} from "../actions/login";

const mapStateToProps = state => {
  return {
    token: sessionStorage.getItem("token"),
    language: state.header.language,
    status: state.login.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (mail, password, language) =>
      dispatch(loginPending(mail, password, language)),
    onRegister: (mail, password, verifyPassword, language) =>
      dispatch(registerPending(mail, password, verifyPassword, language)),
    onGetReset: (mail, language) => dispatch(getResetPending(mail, language))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
