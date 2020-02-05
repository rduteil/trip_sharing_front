import { LoginActions } from "../actions/login";
import { Status } from "../../helpers/enums";

let initialState = {
  status: Status.IDLE,
  error: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LoginActions.LOGIN_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case LoginActions.LOGIN_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case LoginActions.LOGIN_FAILURE: {
      return Object.assign({}, state, {
        status: Status.FAILURE,
        error: action.code
      });
    }
    case LoginActions.REGISTER_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case LoginActions.REGISTER_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case LoginActions.REGISTER_FAILURE: {
      return Object.assign({}, state, {
        status: Status.FAILURE,
        error: action.code
      });
    }
    case LoginActions.GET_RESET_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case LoginActions.GET_RESET_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case LoginActions.GET_RESET_FAILURE: {
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
