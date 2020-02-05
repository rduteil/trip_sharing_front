import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router";

import Spinner from "../../commons/components/spinner";
import Loader from "../../commons/components/loader";

import { LanguagePropTypes } from "../../helpers/strings";
import { Status } from "../../helpers/enums";

import "../styles/reset.css";

class Reset extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cipher: undefined,
      password: "",
      verifyPassword: ""
    };
  }

  componentDidMount = () => {
    this.setState({
      cipher: this.props.match.params.cipher
    });
  };

  onKeyPressed = event => {
    if (this.props.status === Status.PENDING) {
      return;
    } else if (event.key === "Enter") {
      this.props.onSetReset(
        this.state.cipher,
        this.state.password,
        this.state.verifyPassword,
        this.props.language
      );
    }
  };

  render = () => {
    if (this.props.status === Status.SUCCESS) {
      return <Redirect to="/login" push />;
    }

    let isPending = this.props.status === Status.PENDING;

    return (
      <div onKeyPress={this.onKeyPressed}>
        <Spinner zIndex={-1} xWings={false} />
        <div className="ResetWrapper FlexColumn">
          <div className="FlexRow">
            {this.props.language.captions.resetPassword}
          </div>
          <div className="FlexRow">
            <input
              type="password"
              className="FlexInput"
              placeholder={this.props.language.placeholders.password}
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
              placeholder={this.props.language.placeholders.verifyPassword}
              value={this.state.verifyPassword}
              onChange={event => {
                this.setState({ verifyPassword: event.target.value });
              }}
            />
          </div>
          <div className="FlexRow">
            <div
              className="CaptionBox Clickable"
              onClick={() => {
                if (!isPending) {
                  this.props.onSetReset(
                    this.state.cipher,
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
          {isPending ? <Loader /> : undefined}
        </div>
      </div>
    );
  };
}

Reset.propTypes = {
  language: LanguagePropTypes,
  status: PropTypes.oneOf(Object.keys(Status)).isRequired,
  onSetReset: PropTypes.func.isRequired
};

export default Reset;
