import React from "react";
import PropTypes from "prop-types";

import "../styles/toast.css";

class Toast extends React.Component {
  componentDidUpdate = () => {
    if (this.props.time !== 0) {
      setTimeout(this.props.onHide, this.props.time);
    }
  };

  render = () => {
    let hide = this.props.time === 0 && this.props.shows === 0;
    return (
      <div
        className="ToastWrapper"
        style={{ opacity: hide ? 0 : 1, zIndex: hide ? -15 : 15 }}
      >
        <div className={this.props.error ? "ErrorBox" : "MessageBox"}>
          {this.props.message}
        </div>
      </div>
    );
  };
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  time: PropTypes.number.isRequired,
  shows: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired
};

export default Toast;
