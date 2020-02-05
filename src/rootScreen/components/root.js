import React from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router";

class Root extends React.Component {
  render = () => {
    if (this.props.token === null) {
      return <Redirect to="/login" push />;
    } else {
      return (
        <div>
          <div> Token found </div>
          <div
            onClick={() => this.props.onTest(this.props.token)}
            style={{
              backgroundColor: "red",
              height: "100px",
              width: "100px",
              cursor: "pointer"
            }}
          />
        </div>
      );
    }
  };
}

Root.propTypes = {
  token: PropTypes.string,
  onLoadUser: PropTypes.func.isRequired,
  onTest: PropTypes.func.isRequired
};

export default Root;
