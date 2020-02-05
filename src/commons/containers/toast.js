import { connect } from "react-redux";

import Toast from "../components/toast";
import { hide } from "../actions/toast";

const mapStateToProps = state => {
  return {
    message: state.toast.message,
    error: state.toast.error,
    time: state.toast.time,
    shows: state.toast.shows
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onHide: () => dispatch(hide())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toast);
