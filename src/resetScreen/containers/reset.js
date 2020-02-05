import { connect } from "react-redux";

import Reset from "../components/reset";

import { setResetPending } from "../actions/reset";

const mapStateToProps = state => {
  return {
    language: state.header.language,
    status: state.reset.status,
    error: state.reset.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onSetReset: (cipher, password, verifyPassword, language) =>
      dispatch(setResetPending(cipher, password, verifyPassword, language))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset);
