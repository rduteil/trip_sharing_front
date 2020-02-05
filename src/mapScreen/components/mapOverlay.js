import React from "react";
import PropTypes from "prop-types";

import OpenLayers from "../../helpers/openLayers";
import {Modes, Toggles} from "../../helpers/enums";
import { SVG } from "../../helpers/svg";

import "../styles/mapOverlay.css";

class MapOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Respectively: previous, close, drawer, location, images, delete, create, next
      hoverFlags: [false, false, false, false, false, false, false, false]
    };
  }

  setFlag = (index, value) => {
    this.setState(state => {
      let copy = [...state.hoverFlags];
      copy[index] = value;
      return Object.assign({}, state, { hoverFlags: copy });
    });
  };

  previousButton = () => {
    let allowed = this.props.selectedStage > 1;
    if (!allowed && this.state.hoverFlags[0]) {
      this.setFlag(0, false);
    }
    return (
      <div
        className="MapOverlayIcon"
        onMouseUp={() => {
          if (allowed) {
            this.props.onSelectStage(
              this.props.selectedTrip,
              this.props.selectedStage - 1
            );
          }
        }}
        onMouseEnter={() => {
          if (allowed) {
            this.setFlag(0, true);
          }
        }}
        onMouseLeave={() => {
          this.setFlag(0, false);
        }}
        style={{
          backgroundColor: allowed ? "#00000077" : "#ffffff99"
        }}
      >
        <img
          src={SVG.previousWhite}
          alt="Previous"
          style={{ opacity: this.state.hoverFlags[0] ? "0" : "1" }}
        />
        <img
          src={SVG.previousBlack}
          alt="Previous"
          style={{
            opacity: this.state.hoverFlags[0] ? "1" : "0",
            cursor: allowed ? "pointer" : "default"
          }}
        />
      </div>
    );
  };

  closeButton = () => {
    return (
      <div
        className="MapOverlayIcon MapOverlayArc1"
        onMouseUp={() => {
          this.props.onChangeMode(Modes.IDLE);
          this.setFlag(1, false);
        }}
        onMouseEnter={() => this.setFlag(1, true)}
        onMouseLeave={() => this.setFlag(1, false)}
      >
        <img
          src={SVG.closeWhite}
          alt="Previous"
          style={{ opacity: this.state.hoverFlags[1] ? "0" : "1" }}
        />
        <img
          src={SVG.closeBlack}
          alt="Previous"
          style={{
            opacity: this.state.hoverFlags[1] ? "1" : "0",
            cursor: "pointer"
          }}
        />
      </div>
    );
  };

  drawerButton = () => {
    return (
      <div
        className="MapOverlayIcon MapOverlayArc2"
        onMouseUp={() => {
          this.props.onToggleValue(Toggles.DRAWER, true, undefined);
          this.setFlag(2, false);
        }}
        onMouseEnter={() => this.setFlag(2, true)}
        onMouseLeave={() => this.setFlag(2, false)}
      >
        <img
          src={SVG.drawerWhite}
          alt="Relocate"
          style={{ opacity: this.state.hoverFlags[2] ? "0" : "1" }}
        />
        <img
          src={SVG.drawerBlack}
          alt="Relocate"
          style={{
            opacity: this.state.hoverFlags[2] ? "1" : "0",
            cursor: "pointer"
          }}
        />
      </div>
    );
  };

  locationButton = () => {
    return (
      <div
        className="MapOverlayIcon MapOverlayArc3"
        onMouseUp={() => {
          this.props.onChangeMode(Modes.RELOCATE);
          this.setFlag(3, false);
        }}
        onMouseEnter={() => this.setFlag(3, true)}
        onMouseLeave={() => this.setFlag(3, false)}
      >
        <img
          src={SVG.markerWhite}
          alt="Relocate"
          style={{ opacity: this.state.hoverFlags[3] ? "0" : "1" }}
        />
        <img
          src={SVG.markerBlack}
          alt="Relocate"
          style={{
            opacity: this.state.hoverFlags[3] ? "1" : "0",
            cursor: "pointer"
          }}
        />
      </div>
    );
  };

  imagesButton = () => {
    return (
      <div
        className="MapOverlayIcon MapOverlayArc4"
        onMouseUp={() => {
          this.props.onToggleValue(Toggles.CAROUSEL, true, undefined);
          this.setFlag(4, false);
        }}
        onMouseEnter={() => this.setFlag(4, true)}
        onMouseLeave={() => this.setFlag(4, false)}
      >
        <img
          src={SVG.imageWhite}
          alt="Relocate"
          style={{ opacity: this.state.hoverFlags[4] ? "0" : "1" }}
        />
        <img
          src={SVG.imageBlack}
          alt="Relocate"
          style={{
            opacity: this.state.hoverFlags[4] ? "1" : "0",
            cursor: "pointer"
          }}
        />
      </div>
    );
  };

  deleteButton = () => {
    return (
      <div
        className="MapOverlayIcon MapOverlayArc5"
        onMouseUp={() => {
          this.setFlag(5, false);
          this.props.onToggleValue(Toggles.POPUP, true, {
            message:
              this.props.selectedStage === 1
                ? "Do you really want to delete this trip?"
                : "Do you really want to delete this stage and the following ones?",
            buttons: ["Yes", "No"],
            callbacks: [
              () => this.props.onDeleteStage(),
              () => this.props.onToggleValue(Toggles.POPUP, false, undefined)
            ]
          });
        }}
        onMouseEnter={() => this.setFlag(5, true)}
        onMouseLeave={() => this.setFlag(5, false)}
      >
        <img
          src={SVG.deleteWhite}
          alt="Relocate"
          style={{ opacity: this.state.hoverFlags[5] ? "0" : "1" }}
        />
        <img
          src={SVG.deleteBlack}
          alt="Relocate"
          style={{
            opacity: this.state.hoverFlags[5] ? "1" : "0",
            cursor: "pointer"
          }}
        />
      </div>
    );
  };

  createButton = () => {
    let allowed =
      this.props.layer
        .getSource()
        .getFeatureById(this.props.selectedStage + 1) === null;
    return (
      <div
        className="MapOverlayIcon MapOverlayArc6"
        onMouseUp={() => {
          if (allowed) {
            this.props.onChangeMode(Modes.CREATE_STAGE);
            this.setFlag(6, false);
          }
        }}
        onMouseEnter={() => {
          if (allowed) {
            this.setFlag(6, true);
          }
        }}
        onMouseLeave={() => {
          if (allowed) {
            this.setFlag(6, false);
          }
        }}
        style={{
          backgroundColor: allowed ? "#00000077" : "#ffffff77"
        }}
      >
        <img
          src={SVG.addWhite}
          alt="Next"
          style={{ opacity: this.state.hoverFlags[6] ? "0" : "1" }}
        />
        <img
          src={SVG.addBlack}
          alt="Next"
          style={{
            opacity: this.state.hoverFlags[6] ? "1" : "0",
            cursor: allowed ? "pointer" : "default"
          }}
        />
      </div>
    );
  };

  nextButton = () => {
    let allowed =
      this.props.layer
        .getSource()
        .getFeatureById(this.props.selectedStage + 1) !== null;
    if (!allowed && this.state.hoverFlags[7]) {
      this.setFlag(7, false);
    }
    return (
      <div
        className="MapOverlayIcon"
        onMouseUp={() => {
          if (allowed) {
            this.props.onSelectStage(
              this.props.selectedTrip,
              this.props.selectedStage + 1
            );
          }
        }}
        onMouseEnter={() => {
          if (allowed) {
            this.setFlag(7, true);
          }
        }}
        onMouseLeave={() => {
          this.setFlag(7, false);
        }}
        style={{
          backgroundColor: allowed ? "#00000077" : "#ffffff77"
        }}
      >
        <img
          src={SVG.nextWhite}
          alt="Next"
          style={{ opacity: this.state.hoverFlags[7] ? "0" : "1" }}
        />
        <img
          src={SVG.nextBlack}
          alt="Next"
          style={{
            opacity: this.state.hoverFlags[7] ? "1" : "0",
            cursor: allowed ? "pointer" : "default"
          }}
        />
      </div>
    );
  };

  render = () => {
    if (
      this.props.selectedTrip === undefined ||
      this.props.mode === Modes.CREATE_STAGE ||
      this.props.mode === Modes.RELOCATE
    ) {
      return null;
    }
    if (this.props.overlayCollapsed) {
      return (
        <div
          className="MapOverlayWrapper"
          onMouseUp={() => {
            if (!this.props.drawerEnabled) {
              this.props.onToggleValue(Toggles.OVERLAY, false, undefined);
            }
          }}
          style={{ cursor: this.props.drawerEnabled ? "default" : "pointer" }}
        >
          <div className="MapOverlayCircle" />
          <div className="MapOverlayTriangle" />
        </div>
      );
    }
    let text = this.props.layer
      .getSource()
      .getFeatures()
      .filter(feature => feature.getId() === this.props.selectedStage)[0]
      .get("name");

    return (
      <div className="MapOverlayWrapper">
        <div className="MapOverlayArc">
          {this.closeButton()}
          {this.drawerButton()}
          {this.locationButton()}
          {this.imagesButton()}
          {this.deleteButton()}
          {this.createButton()}
        </div>
        <div className="MapOverlayLine">
          {this.previousButton()}
          <input
            className="MapOverlayName"
            type="text"
            value={text}
            onChange={event => this.props.onRenameStage(event.target.value)}
          />
          {this.nextButton()}
        </div>
        <div
          className="MapOverlayTriangle"
          onMouseUp={() =>
            this.props.onToggleValue(Toggles.OVERLAY, true, undefined)
          }
          style={{ cursor: "pointer" }}
        />
      </div>
    );
  };
}

MapOverlay.propTypes = {
  layer: PropTypes.instanceOf(OpenLayers.VectorLayer),
  overlayCollapsed: PropTypes.bool.isRequired,
  mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
  drawerEnabled: PropTypes.bool.isRequired,
  selectedTrip: PropTypes.number,
  selectedStage: PropTypes.number,
  onChangeMode: PropTypes.func.isRequired,
  onRenameStage: PropTypes.func.isRequired,
  onRelocateStage: PropTypes.func.isRequired,
  onDeleteStage: PropTypes.func.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  onToggleValue: PropTypes.func.isRequired
};

export default MapOverlay;
