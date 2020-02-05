import { ToastActions } from "../actions/toast";

let initialState = {
  message: "",
  error: false,
  time: 0,
  shows: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ToastActions.SHOW: {
      return Object.assign({}, state, {
        message: action.message,
        error: action.error,
        time: action.time,
        shows: state.shows + 1
      });
    }
    case ToastActions.HIDE: {
      return Object.assign({}, state, {
        time: 0,
        shows: state.shows - 1
      });
    }
    default: {
      return state;
    }
  }
};
