import { connect } from "react-redux";

import Root from "../components/root";

import { loadUser, test } from "../actions/root";

const mapStateToProps = state => {
  return {
    token: sessionStorage.getItem("token")
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLoadUser: user => dispatch(loadUser(user)),
    onTest: token => dispatch(test(token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
