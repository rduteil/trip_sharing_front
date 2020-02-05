import { push } from "connected-react-router";
import fingerprint from "fingerprintjs2";

import { mergeMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import { from } from "rxjs";

import { show } from "../../commons/actions/toast";
import { codeToString } from "../../helpers/strings";
import { Times } from "../../helpers/enums";

export const LoginActions = {
  LOGIN_PENDING: "LOGIN_PENDING",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  REGISTER_PENDING: "REGISTER_PENDING",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  GET_RESET_PENDING: "GET_RESET_PENDING",
  GET_RESET_SUCCESS: "GET_RESET_SUCCESS",
  GET_RESET_FAILURE: "GET_RESET_FAILURE"
};

export const loginPending = (mail, password, language) => ({
  type: LoginActions.LOGIN_PENDING,
  mail,
  password,
  language
});

const loginSuccess = () => ({
  type: LoginActions.LOGIN_SUCCESS
});

const loginFailure = code => ({
  type: LoginActions.LOGIN_FAILURE,
  code
});

export const registerPending = (mail, password, verifyPassword, language) => ({
  type: LoginActions.REGISTER_PENDING,
  mail,
  password,
  verifyPassword,
  language
});

const registerSuccess = () => ({
  type: LoginActions.REGISTER_SUCCESS
});

const registerFailure = code => ({
  type: LoginActions.REGISTER_FAILURE,
  code
});

export const getResetPending = (mail, language) => ({
  type: LoginActions.GET_RESET_PENDING,
  mail,
  language
});

const getResetSuccess = () => ({
  type: LoginActions.GET_RESET_SUCCESS
});

const getResetFailure = code => ({
  type: LoginActions.GET_RESET_FAILURE,
  code
});

// List of excluded components when building device's fingerprint
const excludes = {
  canvas: true,
  webgl: true,
  plugins: true,
  adBlock: true,
  customEntropyFunction: true,
  fonts: true,
  audio: true,
  sessionStorage: true,
  localStorage: true,
  timezoneOffset: true,
  language: true,
  timezone: true,
  indexedDb: true,
  userAgent: true,
  openDatabase: true,
  doNotTrack: true,
  fontsFlash: true,
  enumerateDevices: true
};

// Return an always resolved promise containing the device's fingerprint
const getFingerprint = () => {
  return new Promise(resolve => {
    fingerprint.get({ excludes: excludes }, components => {
      let values = components.map(component => component.value);
      let murmur = fingerprint.x64hash128(values.join(""), 31);
      resolve(murmur);
    });
  });
};

export const loginEpic = (action$, store$, { ajax }) => {
  return action$.ofType(LoginActions.LOGIN_PENDING).pipe(
    mergeMap(action => {
      if (action.mail.length === 0 || action.password.length === 0) {
        return [
          loginFailure(-5),
          show(codeToString(-5, undefined, action.language), true, Times.NORMAL)
        ];
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.mail)) {
        return [
          loginFailure(-11),
          show(
            codeToString(-11, undefined, action.language),
            true,
            Times.NORMAL
          )
        ];
      } else {
        return from(getFingerprint()).pipe(
          mergeMap(murmur => {
            return ajax({
              url: "https://44c0v.sse.codesandbox.io/login",
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: {
                mail: action.mail,
                password: action.password,
                audience: "forked-jiz13",
                fingerprint: murmur
              }
            }).pipe(
              mergeMap(response => {
                if (response.response.code !== 0) {
                  return [
                    loginFailure(response.response.code),
                    show(
                      codeToString(
                        response.response.code,
                        response.response.time,
                        action.language
                      ),
                      true,
                      Times.NORMAL
                    )
                  ];
                } else {
                  sessionStorage.setItem("token", response.response.token);
                  return [loginSuccess(), push("/")];
                }
              }),
              catchError(() => {
                return [
                  loginFailure(-2),
                  show(
                    codeToString(-2, undefined, action.language),
                    true,
                    Times.NORMAL
                  )
                ];
              })
            );
          })
        );
      }
    })
  );
};

export const registerEpic = action$ => {
  return action$.ofType(LoginActions.REGISTER_PENDING).pipe(
    mergeMap(action => {
      if (action.mail.length === 0 || action.password.length === 0) {
        return [
          registerFailure(-5),
          show(codeToString(-5, null, action.language), true, Times.NORMAL)
        ];
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.mail)) {
        return [
          registerFailure(-11),
          show(codeToString(-11, null, action.language), true, Times.NORMAL)
        ];
      } else if (action.password.length < 8) {
        return [
          registerFailure(-14),
          show(codeToString(-14, null, action.language), true, Times.NORMAL)
        ];
      } else if (action.password !== action.verifyPassword) {
        return [
          registerFailure(-6),
          show(codeToString(-6, null, action.language), true, Times.NORMAL)
        ];
      } else {
        return from(getFingerprint()).pipe(
          mergeMap(murmur => {
            return ajax({
              url: "https://44c0v.sse.codesandbox.io/register",
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: {
                mail: action.mail,
                password: action.password,
                audience: "forked-jiz13",
                fingerprint: murmur
              }
            }).pipe(
              mergeMap(response => {
                if (response.response.code !== 0) {
                  return [
                    registerFailure(response.response.code),

                    show(
                      codeToString(response.data.code, null, action.language),
                      true,
                      Times.NORMAL
                    )
                  ];
                } else {
                  return [
                    registerSuccess(),
                    show(
                      action.language.messages.registerSuccess,
                      false,
                      Times.NORMAL
                    )
                  ];
                }
              }),
              catchError(() => {
                return [
                  getResetFailure(-2),
                  show(
                    codeToString(-2, undefined, action.language),
                    true,
                    Times.NORMAL
                  )
                ];
              })
            );
          })
        );
      }
    })
  );
};

export const getResetEpic = action$ => {
  return action$.ofType(LoginActions.GET_RESET_PENDING).pipe(
    mergeMap(action => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(action.mail)) {
        return [
          getResetFailure(-11),
          show(
            codeToString(-11, undefined, action.language),
            true,
            Times.NORMAL
          )
        ];
      } else {
        return ajax({
          method: "post",
          url: "https://44c0v.sse.codesandbox.io/reset/get",
          headers: { "Content-Type": "application/json" },
          body: {
            mail: action.mail,
            audience: "forked-jiz13"
          }
        }).pipe(
          mergeMap(response => {
            if (response.response.code !== 0) {
              return [
                getResetFailure(response.response.code),
                show(
                  codeToString(
                    response.response.code,
                    undefined,
                    action.language
                  ),
                  true,
                  Times.NORMAL
                )
              ];
            } else {
              return [
                getResetSuccess(),
                show(action.language.messages.resetSuccess, false, Times.NORMAL)
              ];
            }
          }),
          catchError(() => {
            return [
              getResetFailure(-2),
              show(
                codeToString(-2, undefined, action.language),
                true,
                Times.NORMAL
              )
            ];
          })
        );
      }
    })
  );
};
