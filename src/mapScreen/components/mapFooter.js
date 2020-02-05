import React from "react";
import PropTypes from "prop-types";

import { Modes } from "../../helpers/enums";
import { SVG } from "../../helpers/svg";

import "../styles/mapFooter.css";

class MapFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Respectively: geolocation
      hoverFlags: [false]
    };
  }

  leftButtonText = () => {
    switch (this.props.mode) {
      case Modes.IDLE:
        return "Add a trip !";
      case Modes.CREATE:
      case Modes.UPDATE:
      case Modes.RELOCATE:
      case Modes.CREATE_STAGE:
        return "Back";
      default:
        return "Oops, something went wrong...";
    }
  };

  leftButtonClick = () => {
    switch (this.props.mode) {
      case Modes.IDLE:
        this.props.onChangeMode(Modes.CREATE);
        return;
      case Modes.CREATE:
      case Modes.UPDATE:
        this.props.onChangeMode(Modes.IDLE);
        return;
      case Modes.RELOCATE:
      case Modes.CREATE_STAGE:
        this.props.onChangeMode(Modes.UPDATE);
        return;
      default:
        return;
    }
  };

  middleElement = () => {
    switch (this.props.mode) {
      case Modes.IDLE:
        return this.props.hoveredFeature;
      case Modes.CREATE:
        return this.props.hoveredFeature === ""
          ? "Let's start the trip here !"
          : "Let's start the trip in " + this.props.hoveredFeature + " !";
      case Modes.UPDATE:
        return "Update your trip !";
      case Modes.RELOCATE:
        return this.props.hoveredFeature === ""
          ? "Relocate this stage here !"
          : "Relocate this stage in " + this.props.hoveredFeature + " !";
      case Modes.CREATE_STAGE:
        return this.props.hoveredFeature === ""
          ? "Let's continue this trip here !"
          : "Let's contnue this trip in " + this.props.hoveredFeature + " !";
      default:
        return this.props.hoveredFeature;
    }
  };

  rightButton = () => {
    if (this.props.geolocationEnabled) {
      return (
        <div
          className="MapFooterButton"
          onClick={() => this.props.onGeolocalise()}
          onMouseEnter={() => this.setState({ hoverFlags: [true] })}
          onMouseLeave={() => this.setState({ hoverFlags: [false] })}
          style={{
            cursor: "pointer"
          }}
        >
          <img
            src={SVG.locationWhite}
            alt="Get to my location"
            style={{
              opacity: this.state.hoverFlags[0] ? "0" : "1"
            }}
          />
          <img
            src={SVG.locationBlack}
            alt="Get to my location"
            style={{
              opacity: this.state.hoverFlags[0] ? "1" : "0"
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="MapFooterButton">
          <img src={SVG.locationDisabledWhite} alt="Location disabled" />
        </div>
      );
    }
  };

  render = () => {
    return (
      <div className="MapFooter">
        <div className="MapFooterElement">
          <div
            className="MapFooterButton"
            onClick={() => this.leftButtonClick()}
            style={{ cursor: "pointer" }}
          >
            {this.leftButtonText()}
          </div>
        </div>
        <div className="MapFooterElement MapFooterMiddle">
          {this.middleElement()}
        </div>
        <div className="MapFooterElement MapFooterRight">
          {this.rightButton()}
        </div>
      </div>
    );
  };
}

MapFooter.propTypes = {
  geolocationEnabled: PropTypes.bool.isRequired,
  hoveredFeature: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
  onGeolocalise: PropTypes.func.isRequired,
  onChangeMode: PropTypes.func.isRequired
};

export default MapFooter;
