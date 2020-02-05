import React from "react";
import PropTypes from "prop-types";

import OpenLayers from "../../helpers/openLayers";
import { Modes } from "../../helpers/enums";

import Spinner from "../../commons/components/spinner";

import MapDisplayer from "./mapDisplayer";
import MapFooter from "./mapFooter";
import MapDrawer from "./mapDrawer";
import MapPopUp from "./mapPopUp";
import CarouselDisplayer from "./carouselDisplayer";

import "../styles/map.css";

class Map extends React.Component {
  render = () => {
    let layer = this.props.pathLayers.filter(
      layer => layer.get("trip") === this.props.selectedTrip
    )[0];

    return (
      <div className="MapWrapper">
        <div className="MapWrapper-2">
          <CarouselDisplayer
            enabled={this.props.carouselEnabled}
            layer={layer}
            selectedStage={this.props.selectedStage}
            onAddPhoto={this.props.onAddPhoto}
            onUpdatePhoto={this.props.onUpdatePhoto}
            onToggleValue={this.props.onToggleValue}
          />
          {this.props.countryLayers.length !== this.props.countries.length ? (
            <Spinner zIndex={3} xWings={false} />
          ) : null}
          <MapPopUp
            enabled={this.props.popUpEnabled}
            message={this.props.popUpMessage}
            buttons={this.props.popUpButtons}
            callbacks={this.props.popUpCallbacks}
          />
          <MapDisplayer
            map={this.props.map}
            overlayCollapsed={this.props.overlayCollapsed}
            countries={this.props.countries}
            countryLayers={this.props.countryLayers}
            mode={this.props.mode}
            drawerEnabled={this.props.drawerEnabled}
            pathLayers={this.props.pathLayers}
            selectedTrip={this.props.selectedTrip}
            selectedStage={this.props.selectedStage}
            onInitialise={this.props.onInitialise}
            onLoadLayer={this.props.onLoadLayer}
            onHoverFeature={this.props.onHoverFeature}
            onChangeMode={this.props.onChangeMode}
            onCreateTrip={this.props.onCreateTrip}
            onCreateStage={this.props.onCreateStage}
            onRenameStage={this.props.onRenameStage}
            onRelocateStage={this.props.onRelocateStage}
            onDeleteStage={this.props.onDeleteStage}
            onSelectStage={this.props.onSelectStage}
            onToggleValue={this.props.onToggleValue}
          />
          <MapDrawer
            layer={layer}
            drawerEnabled={this.props.drawerEnabled}
            selectedTrip={this.props.selectedTrip}
            selectedStage={this.props.selectedStage}
            onChangeMode={this.props.onChangeMode}
            onRenameStage={this.props.onRenameStage}
            onTransportStage={this.props.onTransportStage}
            onDescribeStage={this.props.onDescribeStage}
            onDeleteStage={this.props.onDeleteStage}
            onSelectStage={this.props.onSelectStage}
            onToggleValue={this.props.onToggleValue}
          />
          <MapFooter
            geolocationEnabled={this.props.geolocationEnabled}
            hoveredFeature={this.props.hoveredFeature}
            mode={this.props.mode}
            onGeolocalise={this.props.onGeolocalise}
            onChangeMode={this.props.onChangeMode}
          />
        </div>
      </div>
    );
  };
}

Map.propTypes = {
  map: PropTypes.instanceOf(OpenLayers.Map),
  overlayCollapsed: PropTypes.bool.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  countryLayers: PropTypes.arrayOf(PropTypes.instanceOf(OpenLayers.VectorLayer))
    .isRequired,
  geolocationEnabled: PropTypes.bool.isRequired,
  popUpEnabled: PropTypes.bool.isRequired,
  popUpMessage: PropTypes.string.isRequired,
  popUpButtons: PropTypes.arrayOf(PropTypes.string).isRequired,
  popUpCallbacks: PropTypes.arrayOf(PropTypes.func).isRequired,
  hoveredFeature: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
  drawerEnabled: PropTypes.bool.isRequired,
  pathLayers: PropTypes.arrayOf(PropTypes.instanceOf(OpenLayers.VectorLayer)),
  selectedTrip: PropTypes.number,
  selectedStage: PropTypes.number,
  carouselEnabled: PropTypes.bool.isRequired,
  onInitialise: PropTypes.func.isRequired,
  onLoadLayer: PropTypes.func.isRequired,
  onHoverFeature: PropTypes.func.isRequired,
  onGeolocalise: PropTypes.func.isRequired,
  onChangeMode: PropTypes.func.isRequired,
  onCreateTrip: PropTypes.func.isRequired,
  onCreateStage: PropTypes.func.isRequired,
  onRenameStage: PropTypes.func.isRequired,
  onRelocateStage: PropTypes.func.isRequired,
  onTransportStage: PropTypes.func.isRequired,
  onDescribeStage: PropTypes.func.isRequired,
  onDeleteStage: PropTypes.func.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  onAddPhoto: PropTypes.func.isRequired,
  onUpdatePhoto: PropTypes.func.isRequired,
  onToggleValue: PropTypes.func.isRequired
};

export default Map;
