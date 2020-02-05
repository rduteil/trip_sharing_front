import { TestScheduler } from "rxjs/testing";
import { ActionsObservable } from "redux-observable";
import { from } from "rxjs";

import {
  LoginActions,
  loginPending,
  registerPending,
  getResetPending,
  loginEpic
} from "../actions/login";
import { ToastActions } from "../../commons/actions/toast";
import { ENG } from "../../helpers/strings";
import { Times } from "../../helpers/enums";

describe("actions creators", () => {
  it("create a login action", () => {
    const mail = "mail";
    const password = "password";
    const language = ENG;

    const expectedAction = {
      type: LoginActions.LOGIN_PENDING,
      mail,
      password,
      language
    };
    expect(loginPending(mail, password, language)).toEqual(expectedAction);
  });

  it("create a register action", () => {
    const mail = "mail";
    const password = "password";
    const verifyPassword = "password";
    const language = ENG;

    const expectedAction = {
      type: LoginActions.REGISTER_PENDING,
      mail,
      password,
      verifyPassword,
      language
    };
    expect(registerPending(mail, password, verifyPassword, language)).toEqual(
      expectedAction
    );
  });

  it("create a get reset action", () => {
    const mail = "mail";
    const language = ENG;

    const expectedAction = {
      type: LoginActions.GET_RESET_PENDING,
      mail,
      language
    };
    expect(getResetPending(mail, language)).toEqual(expectedAction);
  });
});

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe("login epic middleware", () => {
  const Inputs = {
    EMPTY_MAIL: "",
    INVALID_MAIL: "mail",
    PROPER_MAIL: "mail@mail.test",
    PASSWORD: "password",
    LANGUAGE: ENG
  };

  it("empty password or mail address", () => {
    testScheduler.run(({ hot, expectObservable }) => {
      let action$ = new ActionsObservable(
        hot("a", {
          a: {
            type: LoginActions.LOGIN_PENDING,
            mail: Inputs.EMPTY_MAIL,
            password: Inputs.PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

      let output$ = loginEpic(action$, undefined, { ajax: () => ({}) });

      expectObservable(output$).toBe("(ab)", {
        a: {
          type: LoginActions.LOGIN_FAILURE,
          code: -5
        },
        b: {
          type: ToastActions.SHOW,
          message: ENG.errors.emptyCredentials,
          error: true,
          time: Times.NORMAL
        }
      });
    });
  });

  it("invalid mail address", () => {
    testScheduler.run(({ hot, expectObservable }) => {
      let action$ = new ActionsObservable(
        hot("a", {
          a: {
            type: LoginActions.LOGIN_PENDING,
            mail: Inputs.INVALID_MAIL,
            password: Inputs.PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

      let output$ = loginEpic(action$, undefined, { ajax: () => ({}) });

      expectObservable(output$).toBe("(ab)", {
        a: {
          type: LoginActions.LOGIN_FAILURE,
          code: -11
        },
        b: {
          type: ToastActions.SHOW,
          message: ENG.errors.improperMail,
          error: true,
          time: Times.NORMAL
        }
      });
    });
  });

  /*it("wrong credentials", () => {
    testScheduler.run(({ hot, cold, expectObservable }) => {
      let action$ = new ActionsObservable(
        hot("a", {
          a: {
            type: LoginActions.LOGIN_PENDING,
            mail: Inputs.PROPER_MAIL,
            password: Inputs.PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

      let dependencies = {
        getFingerprint: () =>
          from(
            new Promise(resolve => {
              let murmur = "fingerprint";
              resolve(murmur);
            })
          ),

        ajax: () =>
          from(
            new Promise(resolve => {
              let response = {
                response: {
                  code: -3
                }
              };
              resolve(response);
            })
          )
      };

      let output$ = loginEpic(action$, undefined, dependencies);

      expectObservable(output$).toBe("(ab)", {
        a: {
          type: LoginActions.LOGIN_FAILURE,
          code: -3
        },
        b: {
          type: ToastActions.SHOW,
          message: ENG.errors.wrongCredentials,
          error: true,
          time: Times.NORMAL
        }
      });
    });
  });*/
});
