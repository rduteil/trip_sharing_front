import React from "react";
import PropTypes from "prop-types";

import Background from "../../commons/components/background";

import "../styles/mapPopUp.css";

const MapPopUp = ({ enabled, message, buttons, callbacks }) =>
  enabled ? (
    <div>
      <Background />
      <div className="AbsolutePanel" style={{ zIndex: 2 }}>
        <div className="CaptionBox">
          {message}
          <div className="MapPopUpButtons">
            {buttons.map((button, i) => {
              return (
                <div key={i} className="MapPopUpButton" onClick={callbacks[i]}>
                  {button.toUpperCase()}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  ) : null;

MapPopUp.propTypes = {
  enabled: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.string).isRequired,
  callbacks: PropTypes.arrayOf(PropTypes.func).isRequired
};

export default MapPopUp;
