import { TestScheduler } from "rxjs/testing";
import { ActionsObservable } from "redux-observable";
import { throwError, of } from "rxjs";

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
    expect(registerPending(mail, password, verifyPassword, language)).toEqual(expectedAction);
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

describe("login epic", () => {
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

      expectObservable(output$).toBe("(xy)", {
        x: {
          type: LoginActions.LOGIN_FAILURE,
          code: -5
        },
        y: {
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

      expectObservable(output$).toBe("(xy)", {
        x: {
          type: LoginActions.LOGIN_FAILURE,
          code: -11
        },
        y: {
          type: ToastActions.SHOW,
          message: ENG.errors.improperMail,
          error: true,
          time: Times.NORMAL
        }
      });
    });
  });

  it("wrong credentials", () => {
    testScheduler.run(({ hot, expectObservable }) => {
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
        getFingerprint: () => of("fingerprint"),
        ajax: () => of({ response: { code: -3 } })
      };

      let output$ = loginEpic(action$, undefined, dependencies);

      expectObservable(output$).toBe("(xy)", {
        x: {
          type: LoginActions.LOGIN_FAILURE,
          code: -3
        },
        y: {
          type: ToastActions.SHOW,
          message: ENG.errors.wrongCredentials,
          error: true,
          time: Times.NORMAL
        }
      });
    });
  });

  it("server failure", () => {
    testScheduler.run(({ hot, expectObservable }) => {
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
        getFingerprint: () => of("fingerprint"),
        ajax: () => throwError(new Error("Server failure"))
      };

      let output$ = loginEpic(action$, undefined, dependencies);

      expectObservable(output$).toBe("(xy)", {
        x: {
          type: LoginActions.LOGIN_FAILURE,
          code: -2
        },
        y: {
          type: ToastActions.SHOW,
          message: ENG.errors.serverFailure,
          error: true,
          time: Times.NORMAL
        }
      });
    });
  });

  it("login success", () => {
    testScheduler.run(({ hot, expectObservable }) => {
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
        getFingerprint: () => of("fingerprint"),
        ajax: () => of({ response: { code: 0 } })
      };

      let output$ = loginEpic(action$, null, dependencies);

      expectObservable(output$).toBe("(xy)", {
        x: {
          type: LoginActions.LOGIN_SUCCESS
        },
        y: {
          type: "@@router/CALL_HISTORY_METHOD",
          payload: {
            args: ["/"],
            method: "push"
          }
        }
      });
    });
  });
});
