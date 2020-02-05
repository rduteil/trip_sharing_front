import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";

import Background from "../../commons/components/background";
import Dropzone from "../../commons/components/dropzone";
import Loader from "../../commons/components/loader";

import { LanguagePropTypes } from "../../helpers/strings";
import { Status } from "../../helpers/enums";
import "../styles/user.css";

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: "",
      firstName: "",
      lastName: "",
      photo: "",
      password: "",
      verifyPassword: "",
      tab: 0
    };
  }

  componentDidMount = () => {
    // Get user data from token's payload
    let payload = JSON.parse(atob(this.props.token.split(".")[1]));
    // Set the state accordingly
    this.setState({
      mail: payload.mail,
      firstName: payload.firstName,
      lastName: payload.lastName,
      photo: payload.photo
    });
  };

  onKeyPress = event => {
    return;
  };

  render = () => {
    // No token ? Need to login mate
    if (this.props.token === null) {
      return <Redirect to="/login" push />;
    }

    let isPending = this.props.status === Status.PENDING;
    let response = isPending ? <Loader /> : undefined;

    return (
      <div onKeyPress={this.onKeyPress}>
        <div className="AbsolutePanel" style={{ zIndex: -1 }}>
          <Background />
        </div>
        <div className="FlexMarginlessColumn">
          <div className="FlexTabs">
            <div
              className={`FlexTab${
                this.state.tab === 0 ? "Active" : " Clickable"
              }`}
              onClick={() => {
                this.setState({
                  tab: 0
                });
              }}
            >
              {this.props.language.buttons.updateUserForm}
            </div>
            <div
              className={`FlexTab${
                this.state.tab === 1 ? "Active" : " Clickable"
              }`}
              onClick={() => {
                this.setState({
                  tab: 1
                });
              }}
            >
              {this.props.language.buttons.changePasswordForm}
            </div>
          </div>
        </div>
        <div className="FlexMarginlessColumn">
          <div
            className="FlexForm"
            style={{ display: this.state.tab === 1 ? "none" : "flex" }}
          >
            <div className="FlexRow">
              <Dropzone
                onAddPhoto={image => {
                  this.setState({
                    photo: image
                  });
                }}
                override={true}
                image={this.state.photo}
              />
            </div>
            <div className="FlexRow">
              <input
                type="text"
                className="FlexInput"
                placeholder={this.props.language.placeholders.mail}
                value={this.state.mail}
                onChange={event => {
                  this.setState({ mail: event.target.value });
                }}
              />
            </div>
            <div className="FlexRow">
              <input
                type="text"
                className="FlexInput"
                placeholder={this.props.language.placeholders.firstName}
                value={this.state.firstName}
                onChange={event => {
                  this.setState({ firstName: event.target.value });
                }}
              />
            </div>
            <div className="FlexRow">
              <input
                type="text"
                className="FlexInput"
                placeholder={this.props.language.placeholders.lastName}
                value={this.state.lastName}
                onChange={event => {
                  this.setState({ lastName: event.target.value });
                }}
              />
            </div>
            <div className="FlexRow">
              <div
                className="CaptionBox Clickable UserButton"
                onClick={() => {
                  if (!isPending) {
                    this.props.onUpdateUser(
                      this.props.token,
                      this.state.mail,
                      this.state.firstName,
                      this.state.lastName,
                      this.state.photo,
                      this.props.language
                    );
                  }
                }}
              >
                {this.props.language.buttons.validate}
              </div>
            </div>
          </div>
          <div
            className="FlexForm"
            style={{ display: this.state.tab === 0 ? "none" : "flex" }}
          >
            <div className="FlexRow">
              <input
                type="password"
                className="FlexInput"
                placeholder={this.props.language.placeholders.newPassword}
                value={this.state.password}
                onChange={event => {
                  this.setState({ password: event.target.value });
                }}
              />
            </div>
            <div className="FlexRow">
              <input
                type="password"
                className="FlexInput"
                placeholder={this.props.language.placeholders.verifyNewPassword}
                value={this.state.verifyPassword}
                onChange={event => {
                  this.setState({ verifyPassword: event.target.value });
                }}
              />
            </div>
            <div className="FlexRow">
              <div
                className="CaptionBox Clickable UserButton"
                onClick={() => {
                  if (!isPending) {
                    this.props.onChangePassword(
                      this.props.token,
                      this.state.password,
                      this.state.verifyPassword,
                      this.props.language
                    );
                  }
                }}
              >
                {this.props.language.buttons.validate}
              </div>
            </div>
          </div>
          {response}
        </div>
      </div>
    );
  };
}

User.propTypes = {
  token: PropTypes.string,
  language: LanguagePropTypes,
  status: PropTypes.oneOf(Object.keys(Status)).isRequired,
  onUpdateUser: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired
};

export default User;
