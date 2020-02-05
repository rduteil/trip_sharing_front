import { ResetActions } from "../actions/reset";
import { Status } from "../../helpers/enums";

let initialState = {
  status: Status.IDLE,
  error: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ResetActions.SET_RESET_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case ResetActions.SET_RESET_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case ResetActions.SET_RESET_FAILURE: {
      return Object.assign({}, state, {
        status: Status.FAILURE,
        error: action.code
      });
    }
    default: {
      return state;
    }
  }
};
