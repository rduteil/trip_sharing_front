import { HeaderActions } from "../actions/header";
import { ENG, FRA } from "../../helpers/strings";

let initialState = {
  language: ENG
};

export default (state = initialState, action) => {
  switch (action.type) {
    case HeaderActions.SWITCH_LANGUAGE: {
      return Object.assign({}, state, {
        language: state.language === ENG ? FRA : ENG
      });
    }
    default: {
      return state;
    }
  }
};
