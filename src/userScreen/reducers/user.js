import { UserActions } from "../actions/user";
import { Status } from "../../helpers/enums";

let initialState = {
  status: Status.IDLE,
  error: 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UserActions.UPDATE_USER_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case UserActions.UPDATE_USER_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case UserActions.UPDATE_USER_FAILURE: {
      return Object.assign({}, state, {
        status: Status.FAILURE,
        error: action.code
      });
    }
    case UserActions.CHANGE_PASSWORD_PENDING: {
      return Object.assign({}, state, {
        status: Status.PENDING,
        error: 0
      });
    }
    case UserActions.CHANGE_PASSWORD_SUCCESS: {
      return Object.assign({}, state, {
        status: Status.SUCCESS
      });
    }
    case UserActions.CHANGE_PASSWORD_FAILURE: {
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
