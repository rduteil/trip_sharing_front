import reducer from "../reducers/login";
import { LoginActions } from "../actions/login";
import { Status } from "../../helpers/enums";

describe("login reducer", () => {
  let initialState = {
    status: Status.IDLE,
    error: 0
  };
  it("initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("login pending", () => {
    expect(reducer(initialState, { type: LoginActions.LOGIN_PENDING })).toEqual({
      error: 0,
      status: Status.PENDING
    });
  });

  it("login success", () => {
    expect(reducer(initialState, { type: LoginActions.LOGIN_SUCCESS })).toEqual({
      error: 0,
      status: Status.SUCCESS
    });
  });

  it("login failure", () => {
    expect(reducer(initialState, { type: LoginActions.LOGIN_FAILURE, code: -3 })).toEqual({
      error: -3,
      status: Status.FAILURE
    });
  });

  it("register pending", () => {
    expect(reducer(initialState, { type: LoginActions.REGISTER_PENDING })).toEqual({
      error: 0,
      status: Status.PENDING
    });
  });
});
