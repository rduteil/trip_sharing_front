import { ValidateActions } from "../actions/validate";
import { Status } from "../../helpers/enums";

let initialState = {
  status: Status.IDLE,
  error: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ValidateActions.VALIDATE_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case ValidateActions.VALIDATE_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case ValidateActions.VALIDATE_FAILURE: {
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
