import { RootActions } from "../actions/root";

const initialState = {
  user: undefined
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RootActions.LOAD_USER: {
      return Object.assign({}, state, {
        user: action.user
      });
    }
    default: {
      return state;
    }
  }
};
