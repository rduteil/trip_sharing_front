import { connect } from "react-redux";
import {
  initialise,
  loadLayer,
  hoverFeature,
  geolocalise,
  changeMode,
  createTrip,
  createStage,
  renameStage,
  relocateStage,
  transportStage,
  describeStage,
  deleteStage,
  selectStage,
  addPhoto,
  updatePhoto,
  deletePhoto,
  toggleValue
} from "../actions/map";
import Map from "../components/map";

const mapStateToProps = state => {
  return {
    map: state.map.map,
    overlayCollapsed: state.map.overlayCollapsed,
    countries: state.map.countries,
    countryLayers: state.map.countryLayers,
    geolocationEnabled: state.map.geolocationEnabled,
    popUpEnabled: state.map.popUpEnabled,
    popUpMessage: state.map.popUpMessage,
    popUpButtons: state.map.popUpButtons,
    popUpCallbacks: state.map.popUpCallbacks,
    hoveredFeature: state.map.hoveredFeature,
    mode: state.map.mode,
    drawerEnabled: state.map.drawerEnabled,
    pathLayers: state.map.pathLayers,
    selectedTrip: state.map.selectedTrip,
    selectedStage: state.map.selectedStage,
    carouselEnabled: state.map.carouselEnabled
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onInitialise: (map, tripsLayer) => dispatch(initialise(map, tripsLayer)),
    onLoadLayer: layer => dispatch(loadLayer(layer)),
    onHoverFeature: text => dispatch(hoverFeature(text)),
    onGeolocalise: () => dispatch(geolocalise()),
    onChangeMode: mode => dispatch(changeMode(mode)),
    onCreateTrip: point => dispatch(createTrip(point)),
    onCreateStage: point => dispatch(createStage(point)),
    onRenameStage: name => dispatch(renameStage(name)),
    onRelocateStage: point => dispatch(relocateStage(point)),
    onTransportStage: icon => dispatch(transportStage(icon)),
    onDescribeStage: text => dispatch(describeStage(text)),
    onDeleteStage: () => dispatch(deleteStage()),
    onSelectStage: (tripIndex, stageIndex) =>
      dispatch(selectStage(tripIndex, stageIndex)),
    onAddPhoto: (index, photo) => dispatch(addPhoto(index, photo)),
    onUpdatePhoto: (index, text) => dispatch(updatePhoto(index, text)),
    onDeletePhoto: index => dispatch(deletePhoto(index)),
    onToggleValue: (value, state, args) =>
      dispatch(toggleValue(value, state, args))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
