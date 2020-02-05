import { connect } from "react-redux";

import Validate from "../components/validate";
import { validatePending } from "../actions/validate";

const mapStateToProps = state => {
  return {
    language: state.header.language,
    status: state.validate.status,
    error: state.validate.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onValidate: (validation, token) =>
      dispatch(validatePending(validation, token))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Validate);
