import { connect } from "react-redux";

import User from "../components/user";
import { updateUserPending, changePasswordPending } from "../actions/user";

const mapStateToProps = state => {
  return {
    token: sessionStorage.getItem("token"),
    language: state.header.language,
    status: state.user.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateUser: (token, mail, firstName, lastName, photo, language) =>
      dispatch(
        updateUserPending(token, mail, firstName, lastName, photo, language)
      ),
    onChangePassword: (token, password, verifyPassword, language) =>
      dispatch(changePasswordPending(token, password, verifyPassword, language))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
