import React, { Component } from "react";
import PropTypes from "prop-types";

import OpenLayers from "../../helpers/openLayers";
import { Modes, Toggles } from "../../helpers/enums";

import MapOverlay from "../components/mapOverlay";

import "../styles/mapDisplayer.css";

class MapDisplayer extends Component {
  createCountryLayers = () => {
    let countryLayers = [];
    this.props.countries.forEach(url => {
      let source = new OpenLayers.VectorSource({
        url: url,
        format: new OpenLayers.GeoJSON()
      });

      let layer = new OpenLayers.VectorLayer({
        source: source,
        zIndex: 1,
        style: OpenLayers.Styles.country
      });

      source.on("change", () => {
        if (source.getState() === "ready") {
          this.props.onLoadLayer(layer);
        }
      });

      countryLayers.push(layer);
    });
    return countryLayers;
  };

  createOSMLayer = () => {
    return new OpenLayers.TileLayer({
      source: new OpenLayers.OSMSource(),
      zIndex: 0
    });
  };

  createOverlay = () => {
    return new OpenLayers.Overlay({
      id: "overlay",
      element: this.refs.mapOverlay,
      stopEvent: true
    });
  };

  createGeolocation = () => {
    let geolocation = new OpenLayers.Geolocation({
      trackingOptions: {
        enableHighAccuracy: true
      },
      tracking: true,
      projection: new OpenLayers.Projection({ code: "EPSG:3857" })
    });

    let positionFeature = new OpenLayers.Feature({
      type: "geolocation",
      name: "My location"
    });
    positionFeature.setStyle(OpenLayers.Styles.geolocation);
    positionFeature.setId(0);

    geolocation.on("error", () => {
      this.props.onToggleValue(Toggles.GEOLOCATION, false, undefined);
    });

    geolocation.on("change:position", () => {
      this.props.onToggleValue(Toggles.GEOLOCATION, true, undefined);
      let coordinates = geolocation.getPosition();
      positionFeature.setGeometry(coordinates ? new OpenLayers.Point(coordinates) : null);
    });

    return new OpenLayers.VectorLayer({
      source: new OpenLayers.VectorSource({
        features: [positionFeature]
      }),
      zIndex: 3,
      type: "geolocation"
    });
  };

  createTripsLayer = () => {
    return new OpenLayers.VectorLayer({
      source: new OpenLayers.VectorSource({
        features: []
      }),
      zIndex: 2
    });
  };

  componentDidMount = () => {
    let countryLayers = this.createCountryLayers();
    // let osmLayer = this.createOSMLayer();
    let overlay = this.createOverlay();
    let geolocation = this.createGeolocation();
    let tripsLayer = this.createTripsLayer();

    let map = new OpenLayers.Map({
      target: this.refs.mapDisplayer,
      layers: [...countryLayers, geolocation, tripsLayer /*osmLayer*/],
      overlays: [overlay],
      view: new OpenLayers.View({
        center: [0, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 18
      }),
      controls: []
    });

    let highlight = undefined;
    let featureOverlay = new OpenLayers.VectorLayer({
      source: new OpenLayers.VectorSource(),
      map: map,
      style: OpenLayers.Styles.highlight
    });

    map.on("pointermove", event => {
      if (event.dragging) {
        return;
      }
      let features = [];
      map.forEachFeatureAtPixel(map.getEventPixel(event.originalEvent), feature => {
        if (!features.includes(feature)) {
          features.push(feature);
        }
      });
      let feature = undefined;
      for (let singleFeature of features) {
        if (singleFeature !== undefined && singleFeature.get("type") !== "path") {
          feature = singleFeature;
          if (
            singleFeature.get("type") === "geolocation" ||
            singleFeature.get("type") === "trip" ||
            singleFeature.get("type") === "stage" ||
            singleFeature.get("type") === "beginning"
          ) {
            break;
          }
        }
      }

      // Handle pointer
      if (
        this.props.mode === Modes.RELOCATE ||
        this.props.mode === Modes.CREATE ||
        this.props.mode === Modes.CREATE_STAGE
      ) {
        this.refs.mapDisplayer.style.cursor = "pointer";
      } else if (!feature) {
        this.refs.mapDisplayer.style.cursor = "default";
      } else if (
        feature.get("type") === "trip" ||
        feature.get("type") === "stage" ||
        feature.get("type") === "geolocation" ||
        feature.get("type") === "beginning"
      ) {
        this.refs.mapDisplayer.style.cursor = "pointer";
      } else {
        this.refs.mapDisplayer.style.cursor = "default";
      }

      // Handle highlight
      if (feature !== highlight) {
        if (highlight) {
          featureOverlay.getSource().removeFeature(highlight);
          this.props.onHoverFeature("");
        }
        if (feature) {
          featureOverlay.getSource().addFeature(feature);
          this.props.onHoverFeature(feature.get("name"));
        }
        highlight = feature;
      }
    });

    map.on("singleclick", event => {
      let feature = map.forEachFeatureAtPixel(map.getEventPixel(event.originalEvent), feature => {
        if (
          feature.get("type") === "trip" ||
          feature.get("type") === "stage" ||
          feature.get("type") === "geolocation"
        ) {
          return feature;
        }
      });
      let coordinates =
        feature !== undefined ? feature.getGeometry().getCoordinates() : event.coordinate;

      map.getView().animate({
        center: coordinates,
        duration: 250
      });

      if (feature !== undefined && feature.get("type") !== "geolocation") {
        switch (this.props.mode) {
          case Modes.IDLE: {
            this.props.onSelectStage(feature.getId(), 1);
            return;
          }
          default: {
            this.props.onSelectStage(this.props.selectedTrip, feature.getId());
            return;
          }
        }
      } else {
        switch (this.props.mode) {
          case Modes.CREATE: {
            setTimeout(() => {
              this.props.onCreateTrip(event.coordinate);
            }, 250);
            return;
          }
          case Modes.RELOCATE: {
            setTimeout(() => {
              this.props.onRelocateStage(event.coordinate);
            }, 250);
            return;
          }
          case Modes.CREATE_STAGE: {
            setTimeout(() => {
              this.props.onCreateStage(event.coordinate);
            }, 250);
            return;
          }
          default: {
            return;
          }
        }
      }
    });

    this.props.onInitialise(map, tripsLayer);
  };

  render = () => {
    return (
      <div className="MapDisplayer" ref="mapDisplayer">
        <div className="MapOverlay" ref="mapOverlay">
          <MapOverlay
            layer={
              this.props.pathLayers.filter(
                layer => layer.get("trip") === this.props.selectedTrip
              )[0]
            }
            overlayCollapsed={this.props.overlayCollapsed}
            mode={this.props.mode}
            drawerEnabled={this.props.drawerEnabled}
            selectedTrip={this.props.selectedTrip}
            selectedStage={this.props.selectedStage}
            onChangeMode={this.props.onChangeMode}
            onRenameStage={this.props.onRenameStage}
            onRelocateStage={this.props.onRelocateStage}
            onDeleteStage={this.props.onDeleteStage}
            onSelectStage={this.props.onSelectStage}
            onToggleValue={this.props.onToggleValue}
          />
        </div>
      </div>
    );
  };
}

MapDisplayer.propTypes = {
  map: PropTypes.instanceOf(OpenLayers.Map),
  overlayCollapsed: PropTypes.bool.isRequired,
  countries: PropTypes.arrayOf(PropTypes.string).isRequired,
  countryLayers: PropTypes.arrayOf(PropTypes.instanceOf(OpenLayers.VectorLayer)).isRequired,
  mode: PropTypes.oneOf(Object.keys(Modes)).isRequired,
  drawerEnabled: PropTypes.bool.isRequired,
  pathLayers: PropTypes.arrayOf(PropTypes.instanceOf(OpenLayers.VectorLayer)),
  selectedTrip: PropTypes.number,
  selectedStage: PropTypes.number,
  onInitialise: PropTypes.func.isRequired,
  onLoadLayer: PropTypes.func.isRequired,
  onHoverFeature: PropTypes.func.isRequired,
  onChangeMode: PropTypes.func.isRequired,
  onCreateTrip: PropTypes.func.isRequired,
  onCreateStage: PropTypes.func.isRequired,
  onRenameStage: PropTypes.func.isRequired,
  onRelocateStage: PropTypes.func.isRequired,
  onDeleteStage: PropTypes.func.isRequired,
  onSelectStage: PropTypes.func.isRequired,
  onToggleValue: PropTypes.func.isRequired
};

export default MapDisplayer;
