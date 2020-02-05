import { MapActions } from "../actions/map";

import { Modes, Toggles } from "../../helpers/enums";
import OpenLayers from "../../helpers/openLayers";
import { TransportBlack } from "../../helpers/svg";

let initialState = {
  map: new OpenLayers.Map(),

  overlayCollapsed: false,
  geolocationEnabled: true,
  drawerEnabled: false,

  popUpEnabled: false,
  popUpMessage: "",
  popUpButtons: [],
  popUpCallbacks: [],

  countries: [
    "https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/iceland.geojson",
    "https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/france.geojson",
    //"https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/usa.geojson",
    "https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/mexico.geojson",
    "https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/namibia.geojson",
    "https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/ireland.geojson",
    "https://raw.githubusercontent.com/rduteil/GeoJSON/master/per_country/uk.geojson"
  ],
  countryLayers: [],

  hoveredFeature: "",

  mode: Modes.IDLE,

  tripsLayer: undefined,
  pathLayers: [],

  selectedTrip: undefined,
  selectedStage: undefined,

  carouselEnabled: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case MapActions.INITIALISE: {
      return Object.assign({}, state, {
        map: action.map,
        tripsLayer: action.tripsLayer
      });
    }
    case MapActions.LOAD_LAYER: {
      return Object.assign({}, state, {
        countryLayers: [...state.countryLayers, action.layer]
      });
    }
    case MapActions.GEOLOCALISE: {
      let updatedMap = duplicate(state.map);
      updatedMap.getView().animate({
        center: getLayerById(updatedMap, "type", "geolocation")
          .getSource()
          .getFeatureById(0)
          .getGeometry()
          .getCoordinates(),
        duration: 250
      });
      return state;
    }
    case MapActions.HOVER_FEATURE: {
      return Object.assign({}, state, { hoveredFeature: action.text });
    }
    case MapActions.CHANGE_MODE: {
      if (state.mode === Modes.UPDATE && action.mode === Modes.IDLE) {
        let updatedMap = duplicate(state.map);
        updatedMap.getLayers().forEach(layer => {
          if (layer.get("trip") === state.selectedTrip) {
            updatedMap.removeLayer(layer);
          }
        });
        updatedMap.addLayer(state.tripsLayer);
        return Object.assign({}, state, {
          map: updatedMap,
          mode: action.mode,
          drawerEnabled: false,
          overlayCollapsed: false,
          selectedTrip: undefined,
          selectedStage: undefined
        });
      }
      return Object.assign({}, state, { mode: action.mode });
    }
    case MapActions.CREATE_TRIP: {
      let updatedMap = duplicate(state.map);
      updatedMap.removeLayer(state.tripsLayer);

      let updatedTripsLayer = duplicate(state.tripsLayer);
      let tripId = getNextId(state.tripsLayer);

      let path = new OpenLayers.Feature({
        geometry: new OpenLayers.Line([
          OpenLayers.transform(
            OpenLayers.toLongitudeLatitude(action.point),
            "EPSG:4326",
            "EPSG:3857"
          )
        ]),
        name: "Trip's path",
        type: "path"
      });
      path.setId(0);
      path.setStyle(OpenLayers.Styles.path);

      let beginning = new OpenLayers.Feature({
        geometry: new OpenLayers.Point(
          OpenLayers.transform(
            OpenLayers.toLongitudeLatitude(action.point),
            "EPSG:4326",
            "EPSG:3857"
          )
        ),
        name: "My latest trip !",
        insight: "",
        photos: [],
        captions: [],
        type: "stage"
      });
      beginning.setId(1);
      beginning.setStyle(OpenLayers.Styles.beginning);

      let pathLayer = new OpenLayers.VectorLayer({
        source: new OpenLayers.VectorSource({
          features: [path, beginning]
        }),
        zIndex: 2,
        trip: tripId
      });

      let trip = new OpenLayers.Feature({
        geometry: new OpenLayers.Point(
          OpenLayers.transform(
            OpenLayers.toLongitudeLatitude(action.point),
            "EPSG:4326",
            "EPSG:3857"
          )
        ),
        name: "My latest trip !",
        type: "trip"
      });
      trip.setId(tripId);
      trip.setStyle(OpenLayers.Styles.trip);
      updatedTripsLayer.getSource().addFeature(trip);
      updatedMap.addLayer(pathLayer);

      updatedMap.getOverlayById("overlay").setPosition(
        pathLayer
          .getSource()
          .getFeatureById(1)
          .getGeometry()
          .getCoordinates()
      );

      return Object.assign({}, state, {
        map: updatedMap,
        mode: Modes.UPDATE,
        tripsLayer: updatedTripsLayer,
        pathLayers: [...state.pathLayers, pathLayer],
        selectedTrip: tripId,
        selectedStage: 1
      });
    }
    case MapActions.CREATE_STAGE: {
      let newCoordinates = OpenLayers.transform(
        OpenLayers.toLongitudeLatitude(action.point),
        "EPSG:4326",
        "EPSG:3857"
      );

      let updatedMap = duplicate(state.map);

      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );

      let stageId = state.selectedStage + 1;
      let formerCoordinates = updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .getGeometry()
        .getCoordinates();

      let middleCoordinates = [
        (newCoordinates[0] + formerCoordinates[0]) / 2,
        (newCoordinates[1] + formerCoordinates[1]) / 2
      ];

      let path = updatedLayer.getSource().getFeatureById(0);
      path.getGeometry().appendCoordinate(newCoordinates);

      let stage = new OpenLayers.Feature({
        geometry: new OpenLayers.Point(newCoordinates),
        transportation: TransportBlack[3],
        name: "Another stage !",
        insight: "",
        photos: [],
        captions: [],
        type: "stage"
      });
      stage.setId(stageId);
      stage.setStyle(OpenLayers.Styles.stage);
      updatedLayer.getSource().addFeature(stage);

      let transportation = new OpenLayers.Feature({
        geometry: new OpenLayers.Point(middleCoordinates),
        type: "transportation",
        name: "This stage transportation"
      });
      transportation.setId("T" + stageId);
      transportation.setStyle(
        new OpenLayers.Style({
          image: new OpenLayers.Icon({
            src: TransportBlack[3]
          })
        })
      );
      updatedLayer.getSource().addFeature(transportation);

      updatedMap
        .getOverlayById("overlay")
        .setPosition(stage.getGeometry().getCoordinates());

      return Object.assign({}, state, {
        map: updatedMap,
        mode: Modes.UPDATE,
        pathLayers: [...updatedPathLayers, updatedLayer],
        selectedStage: stageId
      });
    }
    case MapActions.RENAME_STAGE: {
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );

      updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .set("name", action.name);

      if (state.selectedStage === 1) {
        let updatedTrips = duplicate(state.tripsLayer);
        updatedTrips
          .getSource()
          .getFeatureById(state.selectedTrip)
          .set("name", action.name);
        return Object.assign({}, state, {
          tripsLayer: updatedTrips,
          pathLayers: [...updatedPathLayers, updatedLayer]
        });
      } else {
        return Object.assign({}, state, {
          pathLayers: [...updatedPathLayers, updatedLayer]
        });
      }
    }
    case MapActions.RELOCATE_STAGE: {
      // Deep copy of all the other trip layers
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      // Deep copy of the current trip layer
      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );

      // Deep copy and update of this trip's path coordinates
      let coordinates = updatedLayer
        .getSource()
        .getFeatureById(0)
        .getGeometry()
        .getCoordinates()
        .slice();
      coordinates[state.selectedStage - 1] = action.point;
      updatedLayer
        .getSource()
        .getFeatureById(0)
        .getGeometry()
        .setCoordinates(coordinates);

      // Update coordinates of the relocated stage
      let currentStage = updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage);
      currentStage.getGeometry().setCoordinates(action.point);

      // If the relocated stage is not the last one, update the coordinates of the next transportation icon
      let nextStage = updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage + 1);
      if (nextStage !== null) {
        let nextPosition = nextStage.getGeometry().getCoordinates();
        nextPosition = [
          (nextPosition[0] + action.point[0]) / 2,
          (nextPosition[1] + action.point[1]) / 2
        ];
        updatedLayer
          .getSource()
          .getFeatureById("T" + (state.selectedStage + 1))
          .getGeometry()
          .setCoordinates(nextPosition);
      }

      // If the relocated stage is not the first one, update the coordinates of the previous transportation icon
      if (state.selectedStage > 1) {
        let previousPosition = updatedLayer
          .getSource()
          .getFeatureById(state.selectedStage - 1)
          .getGeometry()
          .getCoordinates();
        previousPosition = [
          (action.point[0] + previousPosition[0]) / 2,
          (action.point[1] + previousPosition[1]) / 2
        ];
        updatedLayer
          .getSource()
          .getFeatureById("T" + state.selectedStage)
          .getGeometry()
          .setCoordinates(previousPosition);
      }

      // Update position of the map overlay
      let updatedMap = duplicate(state.map);
      updatedMap.getOverlayById("overlay").setPosition(action.point);

      // If the relocated stage is the first one, update the trip's marker location
      if (state.selectedStage === 1) {
        let updatedTrips = duplicate(state.tripsLayer);
        updatedTrips
          .getSource()
          .getFeatureById(state.selectedTrip)
          .getGeometry()
          .setCoordinates(action.point);
        return Object.assign({}, state, {
          map: updatedMap,
          mode: Modes.UPDATE,
          tripsLayer: updatedTrips,
          pathLayers: [...updatedPathLayers, updatedLayer]
        });
      }
      // Otherwise no need to update it
      else {
        return Object.assign({}, state, {
          map: updatedMap,
          mode: Modes.UPDATE,
          pathLayers: [...updatedPathLayers, updatedLayer]
        });
      }
    }
    case MapActions.TRANSPORT_STAGE: {
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );

      updatedLayer
        .getSource()
        .getFeatureById("T" + state.selectedStage)
        .setStyle(
          new OpenLayers.Style({
            image: new OpenLayers.Icon({
              src: action.icon
            })
          })
        );
      updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .set("transportation", action.icon);
      return Object.assign({}, state, {
        pathLayers: [...updatedPathLayers, updatedLayer]
      });
    }
    case MapActions.DESCRIBE_STAGE: {
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );
      updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .set("insight", action.text);

      return Object.assign({}, state, {
        pathLayers: [...updatedPathLayers, updatedLayer]
      });
    }
    case MapActions.DELETE_STAGE: {
      // Deep copy of all the other trip layers
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedMap = duplicate(state.map);

      // The selected trip as a whole is going to oblivion
      if (state.selectedStage === 1) {
        // Remove the trip's marker
        let updatedTripsLayer = duplicate(state.tripsLayer);
        updatedTripsLayer
          .getSource()
          .removeFeature(
            updatedTripsLayer.getSource().getFeatureById(state.selectedTrip)
          );
        // Remove the trip's layer
        updatedMap.getLayers().forEach(layer => {
          if (layer.get("trip") === state.selectedTrip) {
            updatedMap.removeLayer(layer);
          }
        });
        // Add other trips markers
        updatedMap.addLayer(updatedTripsLayer);

        return Object.assign({}, state, {
          map: updatedMap,
          tripsLayer: updatedTripsLayer,
          pathLayers: updatedPathLayers,
          popUpEnabled: false,
          popUpMessage: "",
          popUpButtons: [],
          popUpCallbacks: [],
          mode: Modes.IDLE,
          drawerEnabled: false,
          overlayCollapsed: false,
          selectedTrip: undefined,
          selectedStage: undefined
        });
      }
      // The selected stage and all those after it are going to oblivion
      else {
        // Deep copy of the current trip layer
        let updatedLayer = duplicate(
          extract(state.pathLayers, "trip", state.selectedTrip)
        );
        // Get current trip path
        let pathCoordinates = [
          ...updatedLayer
            .getSource()
            .getFeatureById(0)
            .getGeometry()
            .getCoordinates()
        ];
        // Remove all stages, transportation icons and paths
        updatedLayer
          .getSource()
          .getFeatures()
          .forEach(feature => {
            switch (typeof feature.getId()) {
              case "number": {
                if (feature.getId() >= state.selectedStage) {
                  pathCoordinates.pop();
                  updatedLayer.getSource().removeFeature(feature);
                }
                break;
              }
              case "string": {
                if (feature.getId() >= "T" + state.selectedStage) {
                  updatedLayer.getSource().removeFeature(feature);
                }
                break;
              }
              default: {
                break;
              }
            }
          });
        // Set the new path coordinates
        updatedLayer
          .getSource()
          .getFeatureById(0)
          .getGeometry()
          .setCoordinates(pathCoordinates);
        // Get the coordinates of the first non deleted stage
        let previousCoordinates = updatedLayer
          .getSource()
          .getFeatureById(state.selectedStage - 1)
          .getGeometry()
          .getCoordinates();
        // Set the overlay's position to those coordinates
        updatedMap.getOverlayById("overlay").setPosition(previousCoordinates);
        // Center the map on the first non deleted stage
        updatedMap.getView().animate({
          center: previousCoordinates,
          duration: 250
        });

        return Object.assign({}, state, {
          map: updatedMap,
          pathLayers: [...updatedPathLayers, updatedLayer],
          popUpEnabled: false,
          popUpMessage: "",
          popUpButtons: [],
          popUpCallbacks: [],
          selectedTrip: state.selectedTrip,
          selectedStage: state.selectedStage - 1
        });
      }
    }
    case MapActions.SELECT_STAGE: {
      let stageIndex = action.stageIndex === undefined ? 1 : action.stageIndex;
      let updatedMap = duplicate(state.map);
      if (state.selectedTrip === undefined) {
        updatedMap.removeLayer(state.tripsLayer);
        state.pathLayers
          .filter(layer => layer.get("trip") === action.tripIndex)
          .forEach(layer => updatedMap.addLayer(layer));
      }
      let coordinates = state.pathLayers
        .filter(layer => layer.get("trip") === action.tripIndex)[0]
        .getSource()
        .getFeatureById(stageIndex)
        .getGeometry()
        .getCoordinates();

      updatedMap.getOverlayById("overlay").setPosition(coordinates);

      updatedMap.getView().animate({
        center: coordinates,
        duration: 250
      });

      return Object.assign({}, state, {
        map: updatedMap,
        mode: Modes.UPDATE,
        selectedTrip: action.tripIndex,
        selectedStage: action.stageIndex
      });
    }
    case MapActions.ADD_PHOTO: {
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );

      let currentPhotos = [
        ...updatedLayer
          .getSource()
          .getFeatureById(state.selectedStage)
          .get("photos")
      ];
      let updatedPhotos = undefined;

      let currentCaptions = [
        ...updatedLayer
          .getSource()
          .getFeatureById(state.selectedStage)
          .get("captions")
      ];
      let updatedCaptions = undefined;

      if (currentPhotos.length === 0) {
        updatedPhotos = [action.photo];
        updatedCaptions = [""];
      } else {
        updatedPhotos = [
          ...currentPhotos.slice(0, action.index + 1),
          action.photo,
          ...currentPhotos.slice(action.index + 1, currentPhotos.length)
        ];
        updatedCaptions = [
          ...currentCaptions.slice(0, action.index + 1),
          "",
          ...currentCaptions.slice(action.index + 1, currentCaptions.length)
        ];
      }

      updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .set("photos", updatedPhotos);
      updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .set("captions", updatedCaptions);

      return Object.assign({}, state, {
        pathLayers: [...updatedPathLayers, updatedLayer]
      });
    }
    case MapActions.UPDATE_PHOTO: {
      let updatedPathLayers = state.pathLayers.filter(
        layer => layer.get("trip") !== state.selectedTrip
      );

      let updatedLayer = duplicate(
        extract(state.pathLayers, "trip", state.selectedTrip)
      );

      let currentCaptions = [
        ...updatedLayer
          .getSource()
          .getFeatureById(state.selectedStage)
          .get("captions")
      ];

      let updatedCaptions = [
        ...currentCaptions.slice(0, action.index),
        action.text,
        ...currentCaptions.slice(action.index + 1, currentCaptions.length)
      ];

      updatedLayer
        .getSource()
        .getFeatureById(state.selectedStage)
        .set("captions", updatedCaptions);

      return Object.assign({}, state, {
        pathLayers: [...updatedPathLayers, updatedLayer]
      });
    }
    case MapActions.TOGGLE_VALUE: {
      switch (action.value) {
        case Toggles.OVERLAY: {
          return Object.assign({}, state, { overlayCollapsed: action.state });
        }
        case Toggles.GEOLOCATION: {
          return Object.assign({}, state, { geolocationEnabled: action.state });
        }
        case Toggles.DRAWER: {
          return Object.assign({}, state, {
            drawerEnabled: action.state,
            overlayCollapsed: action.state,
            mode: Modes.UPDATE
          });
        }
        case Toggles.POPUP: {
          if (action.state) {
            return Object.assign({}, state, {
              popUpEnabled: true,
              popUpMessage: action.args.message,
              popUpButtons: action.args.buttons,
              popUpCallbacks: action.args.callbacks
            });
          } else {
            return Object.assign({}, state, {
              popUpEnabled: false,
              popUpMessage: "",
              popUpButtons: [],
              popUpCallbacks: []
            });
          }
        }
        case Toggles.CAROUSEL: {
          return Object.assign({}, state, { carouselEnabled: action.state });
        }
        default: {
          return state;
        }
      }
    }
    default: {
      return state;
    }
  }
};

const getLayerById = (map, property, value) => {
  let returnLayer;
  map.getLayers().forEach(layer => {
    if (layer.get(property) === value) {
      returnLayer = layer;
    }
  });
  return returnLayer;
};

const getNextId = layer => {
  let newId = 0;
  layer
    .getSource()
    .getFeatures()
    .forEach(feature => {
      if (feature.getId() >= newId) {
        newId = feature.getId() + 1;
      }
    });
  return newId;
};

const extract = (array, property, value) => {
  return array.filter(layer => layer.get(property) === value)[0];
};

const duplicate = object => {
  return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
};
