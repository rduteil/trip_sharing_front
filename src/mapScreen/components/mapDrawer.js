import React from "react";
import PropTypes from "prop-types";

import OpenLayers from "../../helpers/openLayers";
import { Modes, Toggles } from "../../helpers/enums";
import { SVG, TransportBlack, TransportWhite } from "../../helpers/svg";

import "../styles/mapDrawer.css";

class MapDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Respectively close, previous, next, create, relocate, images, delete
      hoverFlags: [false, false, false, false, false, false, false],
      // Respectively plane, walk, bike, car, bus, train, boat
      transportationFlags: [false, false, false, false, false, false, false]
    };
  }

  setFlag = (index, value) => {
    this.setState(state => {
      let copy = [...state.hoverFlags];
      copy[index] = value;
      return Object.assign({}, state, { hoverFlags: copy });
    });
  };

  setTransport = (index, value) => {
    this.setState(state => {
      let copy = [...state.transportationFlags];
      copy[index] = value;
      return Object.assign({}, state, { transportationFlags: copy });
    });
  };

  closeButton = () => {
    return (
      <div
        className="MapDrawerIcon"
        onClick={() =>
          this.props.onToggleValue(Toggles.DRAWER, false, undefined)
        }
        onMouseEnter={() => this.setFlag(0, true)}
        onMouseLeave={() => this.setFlag(0, false)}
      >
        <img
          src={SVG.closeDrawerWhite}
          style={{
            opacity: this.state.hoverFlags[0] ? 0 : 1,
            cursor: "pointer"
          }}
          alt="Close"
        />
        <img
          src={SVG.closeDrawerBlack}
          style={{
            opacity: this.state.hoverFlags[0] ? 1 : 0,
            cursor: "pointer"
          }}
          alt="Close"
        />
      </div>
    );
  };

  navigateLine = () => {
    let previousAllowed = this.props.selectedStage > 1;
    let nextAllowed =
      this.props.layer
        .getSource()
        .getFeatureById(this.props.selectedStage + 1) !== null;
    return (
      <div className="MapDrawerLine">
        <div
          className="MapDrawerIcon"
          onClick={() => {
            if (previousAllowed) {
              this.props.onSelectStage(
                this.props.selectedTrip,
                this.props.selectedStage - 1
              );
              this.setFlag(1, false);
            }
          }}
          onMouseEnter={() => {
            if (previousAllowed) {
              this.setFlag(1, true);
            }
          }}
          onMouseLeave={() => {
            if (previousAllowed) {
              this.setFlag(1, false);
            }
          }}
        >
          <img
            src={SVG.previousWhite}
            style={{ opacity: this.state.hoverFlags[1] ? 0 : 1 }}
            alt="Previous"
          />
          <img
            src={SVG.previousBlack}
            style={{
              opacity: this.state.hoverFlags[1] ? 1 : 0,
              cursor: previousAllowed ? "pointer" : "default"
            }}
            alt="Previous"
          />
        </div>
        <div className="MapDrawerElement" style={{ userSelect: "none" }}>
          Navigate
        </div>
        <div
          className="MapDrawerIcon"
          onClick={() => {
            if (nextAllowed) {
              this.props.onSelectStage(
                this.props.selectedTrip,
                this.props.selectedStage + 1
              );
              this.setFlag(2, false);
            }
          }}
          onMouseEnter={() => {
            if (nextAllowed) {
              this.setFlag(2, true);
            }
          }}
          onMouseLeave={() => {
            if (nextAllowed) {
              this.setFlag(2, false);
            }
          }}
        >
          <img
            src={SVG.nextWhite}
            style={{ opacity: this.state.hoverFlags[2] ? 0 : 1 }}
            alt="Next"
          />
          <img
            src={SVG.nextBlack}
            style={{
              opacity: this.state.hoverFlags[2] ? 1 : 0,
              cursor: nextAllowed ? "pointer" : "default"
            }}
            alt="Next"
          />
        </div>
      </div>
    );
  };

  createLine = () => {
    if (
      this.props.layer
        .getSource()
        .getFeatureById(this.props.selectedStage + 1) !== null
    ) {
      return null;
    }

    return (
      <div
        className="MapDrawerClickable"
        onClick={() => this.props.onChangeMode(Modes.CREATE_STAGE)}
        onMouseEnter={() => this.setFlag(3, true)}
        onMouseLeave={() => this.setFlag(3, false)}
      >
        <div
          className="MapDrawerIcon"
          style={{
            marginRight: "8px"
          }}
        >
          <img
            src={SVG.addWhite}
            style={{
              opacity: this.state.hoverFlags[3] ? 0 : 1
            }}
            alt="Close"
          />
          <img
            src={SVG.addBlack}
            style={{
              opacity: this.state.hoverFlags[3] ? 1 : 0
            }}
            alt="Close"
          />
        </div>
        <div
          className="MapDrawerElement"
          style={{ color: this.state.hoverFlags[3] ? "#000000" : "#ffffff" }}
        >
          Add a new stage
        </div>
      </div>
    );
  };

  insightArea = () => {
    return (
      <textarea
        className="MapDrawerInsight"
        rows="4"
        placeholder="Give us an insight !"
        value={this.props.layer
          .getSource()
          .getFeatureById(this.props.selectedStage)
          .get("insight")}
        onChange={event => this.props.onDescribeStage(event.target.value)}
      />
    );
  };

  relocateLine = () => {
    return (
      <div
        className="MapDrawerClickable"
        onClick={() => this.props.onChangeMode(Modes.RELOCATE)}
        onMouseEnter={() => this.setFlag(4, true)}
        onMouseLeave={() => this.setFlag(4, false)}
      >
        <div
          className="MapDrawerIcon"
          style={{
            marginRight: "8px"
          }}
        >
          <img
            src={SVG.markerWhite}
            style={{
              opacity: this.state.hoverFlags[4] ? 0 : 1
            }}
            alt="Close"
          />
          <img
            src={SVG.markerBlack}
            style={{
              opacity: this.state.hoverFlags[4] ? 1 : 0
            }}
            alt="Close"
          />
        </div>
        <div
          className="MapDrawerElement"
          style={{ color: this.state.hoverFlags[4] ? "#000000" : "#ffffff" }}
        >
          Relocate this stage
        </div>
      </div>
    );
  };

  transportationButtons = () => {
    if (this.props.selectedStage <= 1) {
      return null;
    }

    let buttons = [];
    for (let i = 0; i < TransportWhite.length; i++) {
      let selected =
        this.props.layer
          .getSource()
          .getFeatureById(this.props.selectedStage)
          .get("transportation") === TransportBlack[i];
      if (selected) {
        buttons.push(
          <div className="MapDrawerTransport">
            <img src={TransportBlack[i]} alt={i} />
          </div>
        );
      } else {
        buttons.push(
          <div
            className="MapDrawerTransport"
            onMouseEnter={() => this.setTransport(i, true)}
            onMouseLeave={() => this.setTransport(i, false)}
            onClick={() => {
              this.props.onTransportStage(TransportBlack[i]);
              this.setTransport(i, false);
            }}
          >
            <img
              src={TransportWhite[i]}
              alt={i}
              style={{ opacity: this.state.transportationFlags[i] ? 0 : 1 }}
            />
            <img
              src={TransportBlack[i]}
              alt={i}
              style={{
                opacity: this.state.transportationFlags[i] ? 1 : 0,
                cursor: "pointer"
              }}
            />
          </div>
        );
      }
    }

    return (
      <div className="MapDrawerLine">
        {buttons.map((button, i) => (
          <React.Fragment key={i}>{button}</React.Fragment>
        ))}
      </div>
    );
  };

  deleteLine = () => {
    return (
      <div
        className="MapDrawerClickable"
        onClick={() =>
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
          })
        }
        onMouseEnter={() => this.setFlag(6, true)}
        onMouseLeave={() => this.setFlag(6, false)}
      >
        <div
          className="MapDrawerIcon"
          style={{
            marginRight: "8px"
          }}
        >
          <img
            src={SVG.deleteWhite}
            style={{
              opacity: this.state.hoverFlags[6] ? 0 : 1
            }}
            alt="Close"
          />
          <img
            src={SVG.deleteBlack}
            style={{
              opacity: this.state.hoverFlags[6] ? 1 : 0
            }}
            alt="Close"
          />
        </div>
        <div
          className="MapDrawerElement"
          style={{ color: this.state.hoverFlags[6] ? "#000000" : "#ffffff" }}
        >
          Delete this stage
        </div>
      </div>
    );
  };

  render = () => {
    if (this.props.layer === undefined) {
      return null;
    }

    return (
      <div
        className={
          this.props.drawerEnabled
            ? "MapDrawerWrapper"
            : "MapDrawerWrapper MapDrawerWrapperHidden"
        }
      >
        <div className="MapDrawer">
          <div className="MapDrawerLine">
            <input
              className="MapDrawerElement"
              onChange={event => this.props.onRenameStage(event.target.value)}
              value={this.props.layer
                .getSource()
                .getFeatureById(this.props.selectedStage)
                .get("name")}
            />
            {this.closeButton()}
          </div>
          <div className="MapDrawerSeparator" />
          {this.navigateLine()}
          {this.insightArea()}
          {this.transportationButtons()}
          <div className="MapDrawerSeparator" />
          {this.createLine()}
          {this.relocateLine()}
          {this.deleteLine()}
        </div>
      </div>
    );
  };
}

MapDrawer.propTypes = {
  layer: PropTypes.instanceOf(OpenLayers.VectorLayer),
  selectedTrip: PropTypes.number,
  selectedStage: PropTypes.number,
  drawerEnabled: PropTypes.bool.isRequired,
  onChangeMode: PropTypes.func.isRequired,
  onRenameStage: PropTypes.func.isRequired,
  onTransportStage: PropTypes.func.isRequired,
  onDescribeStage: PropTypes.func.isRequired,
  onDeleteStage: PropTypes.func.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  onToggleValue: PropTypes.func.isRequired
};

export default MapDrawer;
