import { HeaderActions, switchLanguage } from "../actions/header";
import { ToastActions, show, hide } from "../actions/toast";
import { Times } from "../../helpers/enums";

describe("actions creators", () => {
  it("create a switch language action", () => {
    const expectedAction = {
      type: HeaderActions.SWITCH_LANGUAGE
    };
    expect(switchLanguage()).toEqual(expectedAction);
  });

  it("create a show action", () => {
    const message = "Toast message";
    const error = 0;
    const time = Times.NORMAL;

    const expectedAction = {
      type: ToastActions.SHOW,
      message,
      error,
      time
    };
    expect(show(message, error, time)).toEqual(expectedAction);
  });

  it("create a hide action", () => {
    const expectedAction = {
      type: ToastActions.HIDE
    };
    expect(hide()).toEqual(expectedAction);
  });
});
