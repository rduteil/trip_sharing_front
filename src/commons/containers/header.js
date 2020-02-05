import { connect } from "react-redux";
import { push } from "connected-react-router";

import Header from "../components/header";

import { switchLanguage } from "../actions/header";

const mapStateToProps = state => {
  return {
    language: state.header.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSwitchLanguage: () => dispatch(switchLanguage()),
    onPushUser: () => dispatch(push("/user"))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
