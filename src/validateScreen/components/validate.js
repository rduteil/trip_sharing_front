import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import Spinner from "../../commons/components/spinner";
import Loader from "../../commons/components/loader";

import { LanguagePropTypes, codeToString } from "../../helpers/strings";
import { Status } from "../../helpers/enums";

import "../styles/validate.css";

class Validate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 0
    };
  }

  componentDidMount = () => {
    this.setState(
      {
        type: parseInt(this.props.match.params.type, 10)
      },
      () => {
        this.props.onValidate(this.state.type, this.props.match.params.token);
      }
    );
  };

  render = () => {
    let response = undefined;
    switch (this.props.status) {
      case Status.IDLE:
        break;
      case Status.PENDING: {
        response = <Loader />;
        break;
      }
      case Status.SUCCESS: {
        let message = undefined;
        switch (this.state.type) {
          case 0: {
            message = this.props.language.messages.verifySuccess;
            break;
          }
          case 1: {
            message = this.props.language.messages.allowSuccess;
            break;
          }
          default: {
            break;
          }
        }
        response = <div className="CaptionBox">{message}</div>;
        break;
      }
      case Status.FAILURE: {
        response = (
          <div className="ErrorBox">
            {codeToString(this.props.error, undefined, this.props.language)}
          </div>
        );
        break;
      }
      default: {
        break;
      }
    }

    return (
      <div>
        <Spinner zIndex={-1} xWings={false} />
        <div className="FlexColumn ValidateWrapper">{response}</div>
      </div>
    );
  };
}

Validate.propTypes = {
  language: LanguagePropTypes,
  status: PropTypes.oneOf(Object.keys(Status)).isRequired,
  error: PropTypes.number,
  onValidate: PropTypes.func.isRequired
};

export default withRouter(Validate);
