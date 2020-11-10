import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";

import Loader from "../../commons/components/loader";
import Spinner from "../../commons/components/spinner";
import Icon from "../../commons/components/icon";

import { LanguagePropTypes } from "../../helpers/strings";
import { Status } from "../../helpers/enums";

import "../styles/login.css";
import { SVG } from "../../helpers/svg";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mail: "",
      password: "",
      verifyPassword: "",
      tab: 0
    };
  }

  onKeyPressed = event => {
    if (this.props.status === Status.PENDING) {
      return;
    } else if (event.key === "Enter") {
      switch (this.state.tab) {
        case 0: {
          this.props.onLogin(this.state.mail, this.state.password, this.props.language);
          return;
        }
        case 1: {
          this.props.onRegister(
            this.state.mail,
            this.state.password,
            this.state.verifyPassword,
            this.props.language
          );
          return;
        }
        default: {
          return;
        }
      }
    }
  };

  render = () => {
    if (this.props.token !== null) {
      return <Redirect to="/" push />;
    }

    let isPending = this.props.status === Status.PENDING;
    let response = isPending ? <Loader /> : undefined;

    return (
      <div onKeyPress={this.onKeyPressed}>
        <Spinner zIndex={-1} xWings={false} />
        <div className="FlexMarginlessColumn">
          <div className="FlexTabs">
            <div
              className={`FlexTab${this.state.tab === 0 ? "Active" : " Clickable"}`}
              onClick={() => {
                this.setState({
                  tab: 0
                });
              }}>
              {this.props.language.buttons.loginForm}
            </div>
            <div
              className={`FlexTab${this.state.tab === 1 ? "Active" : " Clickable"}`}
              onClick={() => {
                this.setState({
                  tab: 1
                });
              }}>
              {this.props.language.buttons.registrationForm}
            </div>
          </div>
        </div>
        <div className="FlexMarginlessColumn">
          <div className="FlexForm">
            <input
              type="email"
              placeholder={this.props.language.placeholders.mail}
              className="FlexInput"
              value={this.state.mail}
              onChange={event => {
                this.setState({ mail: event.target.value });
              }}
            />
            <div className="FlexRow">
              <input
                type="password"
                placeholder={this.props.language.placeholders.password}
                className="FlexPassword"
                value={this.state.password}
                onChange={event => {
                  this.setState({ password: event.target.value });
                }}
              />
              <Icon
                overlay={false}
                enabled={true}
                defaultIcon={SVG.closeWhite}
                hoverIcon={SVG.closeBlack}
                onClick={() => ({})}
              />
            </div>
            <div
              className="LoginButton FlexRow"
              style={{ display: this.state.tab === 0 ? "" : "none" }}>
              <div
                className="LoginCaption Clickable"
                onClick={() => {
                  if (!isPending) {
                    this.props.onGetReset(this.state.mail, this.props.language);
                  }
                }}>
                {this.props.language.buttons.forgotPassword}
              </div>
              <div
                className="CaptionBox Clickable"
                onClick={() => {
                  if (!isPending) {
                    this.props.onLogin(this.state.mail, this.state.password, this.props.language);
                  }
                }}>
                {this.props.language.buttons.login}
              </div>
            </div>

            <div className="FlexRow" style={{ display: this.state.tab === 1 ? "" : "none" }}>
              <input
                type="password"
                placeholder={this.props.language.placeholders.verifyPassword}
                className="FlexPassword"
                value={this.state.verifyPassword}
                onChange={event => {
                  this.setState({ verifyPassword: event.target.value });
                }}
              />
              <Icon
                overlay={false}
                enabled={true}
                defaultIcon={SVG.closeWhite}
                hoverIcon={SVG.closeBlack}
                onClick={() => ({})}
              />
            </div>
            <div
              className="CaptionBox Clickable LoginButton"
              style={{ display: this.state.tab === 1 ? "" : "none" }}
              onClick={() => {
                if (!isPending) {
                  this.props.onRegister(
                    this.state.mail,
                    this.state.password,
                    this.state.verifyPassword,
                    this.props.language
                  );
                }
              }}>
              {this.props.language.buttons.register}
            </div>
          </div>
          {response}
        </div>
      </div>
    );
  };
}

Login.propTypes = {
  token: PropTypes.string,
  language: LanguagePropTypes,
  status: PropTypes.oneOf(Object.keys(Status)).isRequired,
  onLogin: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onGetReset: PropTypes.func.isRequired
};

export default Login;
