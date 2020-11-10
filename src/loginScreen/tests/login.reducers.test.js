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

  it("register success", () => {
    expect(reducer(initialState, { type: LoginActions.REGISTER_SUCCESS })).toEqual({
      error: 0,
      status: Status.SUCCESS
    });
  });

  it("register failure", () => {
    expect(reducer(initialState, { type: LoginActions.REGISTER_FAILURE, code: -5 })).toEqual({
      error: -5,
      status: Status.FAILURE
    });
  });

  it("get reset pending", () => {
    expect(reducer(initialState, { type: LoginActions.GET_RESET_PENDING })).toEqual({
      error: 0,
      status: Status.PENDING
    });
  });

  it("get reset success", () => {
    expect(reducer(initialState, { type: LoginActions.GET_RESET_SUCCESS })).toEqual({
      error: 0,
      status: Status.SUCCESS
    });
  });

  it("get reset failure", () => {
    expect(reducer(initialState, { type: LoginActions.GET_RESET_FAILURE, code: -1 })).toEqual({
      error: -1,
      status: Status.FAILURE
    });
  });
});
