export const MapActions = {
  // Map actions
  INITIALISE: "INITIALISE",
  LOAD_LAYER: "LOAD_LAYER",
  HOVER_FEATURE: "HOVER_FEATURE",
  // Footer actions
  GEOLOCALISE: "GEOLOCALISE",
  CHANGE_MODE: "CHANGE_MODE",
  // Trips actions
  CREATE_TRIP: "CREATE_TRIP",
  // Stages actions
  CREATE_STAGE: "CREATE_STAGE",
  RENAME_STAGE: "RENAME_STAGE",
  RELOCATE_STAGE: "RELOCATE_STAGE",
  TRANSPORT_STAGE: "TRANSPORT_STAGE",
  DESCRIBE_STAGE: "DESCRIBE_STAGE",
  DELETE_STAGE: "DELETE_STAGE",
  SELECT_STAGE: "SELECT_STAGE",
  // Photos actions
  ADD_PHOTO: "ADD_PHOTO",
  UPDATE_PHOTO: "UPDATE_PHOTO",
  DELETE_PHOTO: "DELETE_PHOTO",
  // Reusable actions
  TOGGLE_VALUE: "TOGGLE_VALUE"
};

export const initialise = (map, tripsLayer) => {
  return { type: MapActions.INITIALISE, map, tripsLayer };
};

export const loadLayer = layer => {
  return { type: MapActions.LOAD_LAYER, layer };
};

export const hoverFeature = text => {
  return { type: MapActions.HOVER_FEATURE, text };
};

export const geolocalise = () => {
  return { type: MapActions.GEOLOCALISE };
};

export const changeMode = mode => {
  return { type: MapActions.CHANGE_MODE, mode };
};

export const createTrip = point => {
  return { type: MapActions.CREATE_TRIP, point };
};

export const createStage = point => {
  return { type: MapActions.CREATE_STAGE, point };
};

export const renameStage = name => {
  return { type: MapActions.RENAME_STAGE, name };
};

export const relocateStage = point => {
  return { type: MapActions.RELOCATE_STAGE, point };
};

export const transportStage = icon => {
  return { type: MapActions.TRANSPORT_STAGE, icon };
};

export const describeStage = text => {
  return { type: MapActions.DESCRIBE_STAGE, text };
};

export const deleteStage = () => {
  return { type: MapActions.DELETE_STAGE };
};

export const selectStage = (tripIndex, stageIndex) => {
  return { type: MapActions.SELECT_STAGE, tripIndex, stageIndex };
};

export const addPhoto = (index, photo) => {
  return { type: MapActions.ADD_PHOTO, index, photo };
};

export const updatePhoto = (index, text) => {
  return { type: MapActions.UPDATE_PHOTO, index, text };
};

export const deletePhoto = index => {
  return { type: MapActions.DELETE_PHOTO, index };
};

export const toggleValue = (value, state, args) => {
  return { type: MapActions.TOGGLE_VALUE, value, state, args };
};
