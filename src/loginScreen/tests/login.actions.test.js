import { TestScheduler } from "rxjs/testing";
import { ActionsObservable } from "redux-observable";
import { throwError, of } from "rxjs";

import {
  LoginActions,
  loginPending,
  registerPending,
  getResetPending,
  loginEpic,
  registerEpic,
  getResetEpic
} from "../actions/login";
import { ToastActions } from "../../commons/actions/toast";
import { ENG, Connection } from "../../helpers/strings";
import { Times } from "../../helpers/enums";

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

const Inputs = {
  EMPTY: "",
  INVALID_MAIL: "mail",
  USER_MAIL: "current@mail.test",
  NEW_MAIL: "new@mail.test",
  INVALID_PASSWORD: "wrong",
  PROPER_PASSWORD: "nicepassword",
  LANGUAGE: ENG
};

const dependencies = {
  getFingerprint: () => of("murmur"),
  ajax: payload => {
    // Check the endpoint
    if (payload.url.endsWith(Connection.ENDPOINTS.LOGIN)) {
      if (payload.body.mail !== Inputs.USER_MAIL) {
        return of({ response: { code: -3 } });
      } else if (payload.body.password !== Inputs.PROPER_PASSWORD) {
        return of({ response: { code: -3 } });
      } else {
        return of({ response: { code: 0 } });
      }
    } else if (payload.url.endsWith(Connection.ENDPOINTS.REGISTER)) {
      if (payload.body.mail === Inputs.USER_MAIL) {
        return of({ response: { code: -1 } });
      } else {
        return of({ response: { code: 0 } });
      }
    } else if (payload.url.endsWith(Connection.ENDPOINTS.RESET_GET)) {
      if (payload.body.mail === Inputs.USER_MAIL) {
        return of({ response: { code: 0 } });
      } else {
        return of({ response: { code: -3 } });
      }
    } else {
      return throwError(new Error("Server failure"));
    }
  }
};

describe("actions creators", () => {
  it("create a login pending action", () => {
    const expectedAction = {
      type: LoginActions.LOGIN_PENDING,
      mail: Inputs.PROPER_MAIL,
      password: Inputs.PROPER_PASSWORD,
      language: Inputs.LANGUAGE
    };
    expect(loginPending(Inputs.PROPER_MAIL, Inputs.PROPER_PASSWORD, Inputs.LANGUAGE)).toEqual(
      expectedAction
    );
  });

  it("create a register pending action", () => {
    const expectedAction = {
      type: LoginActions.REGISTER_PENDING,
      mail: Inputs.PROPER_MAIL,
      password: Inputs.PROPER_PASSWORD,
      verifyPassword: Inputs.PROPER_PASSWORD,
      language: Inputs.LANGUAGE
    };
    expect(
      registerPending(
        Inputs.PROPER_MAIL,
        Inputs.PROPER_PASSWORD,
        Inputs.PROPER_PASSWORD,
        Inputs.LANGUAGE
      )
    ).toEqual(expectedAction);
  });

  it("create a get reset pending action", () => {
    const expectedAction = {
      type: LoginActions.GET_RESET_PENDING,
      mail: Inputs.PROPER_MAIL,
      language: Inputs.LANGUAGE
    };
    expect(getResetPending(Inputs.PROPER_MAIL, Inputs.LANGUAGE)).toEqual(expectedAction);
  });
});

describe("login epic", () => {
  it("empty password or mail address", () => {
    testScheduler.run(({ hot, expectObservable }) => {
      let action$ = new ActionsObservable(
        hot("a", {
          a: {
            type: LoginActions.LOGIN_PENDING,
            mail: Inputs.EMPTY,
            password: Inputs.PROPER_PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

      let output$ = loginEpic(action$, undefined, dependencies);

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
            password: Inputs.PROPER_PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

      let output$ = loginEpic(action$, undefined, dependencies);

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
            mail: Inputs.USER_MAIL,
            password: Inputs.INVALID_PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

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

  it("login success", () => {
    testScheduler.run(({ hot, expectObservable }) => {
      let action$ = new ActionsObservable(
        hot("a", {
          a: {
            type: LoginActions.LOGIN_PENDING,
            mail: Inputs.USER_MAIL,
            password: Inputs.PROPER_PASSWORD,
            language: Inputs.LANGUAGE
          }
        })
      );

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

describe("register epic", () => {
  it("empty mail address", () => {
    testScheduler.run(({ hot, expectObservable }) => {
      let action$ = new ActionsObservable(
        hot("a", {
          a: {
            type: LoginActions.GET_RESET_PENDING,
            mail: Inputs.EMPTY,
            language: Inputs.LANGUAGE
          }
        })
      );

      let output$ = getResetEpic(action$, undefined, dependencies);

      expectObservable(output$).toBe("(xy)", {
        x: {
          type: LoginActions.GET_RESET_FAILURE,
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
});
