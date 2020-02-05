import { mergeMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

import { show } from "../../commons/actions/toast";
import { codeToString } from "../../helpers/strings";
import { Times } from "../../helpers/enums";

export const UserActions = {
  UPDATE_USER_PENDING: "UPDATE_USER_PENDING",
  UPDATE_USER_SUCCESS: "UPDATE_USER_SUCCESS",
  UPDATE_USER_FAILURE: "UPDATE_USER_FAILURE",
  CHANGE_PASSWORD_PENDING: "CHANGE_PASSWORD_PENDING",
  CHANGE_PASSWORD_SUCCESS: "CHANGE_PASSWORD_SUCCESS",
  CHANGE_PASSWORD_FAILURE: "CHANGE_PASSWORD_FAILURE"
};

export const updateUserPending = (
  token,
  mail,
  firstName,
  lastName,
  photo,
  language
) => ({
  type: UserActions.UPDATE_USER_PENDING,
  token,
  mail,
  firstName,
  lastName,
  photo,
  language
});

const updateUserSuccess = () => ({
  type: UserActions.UPDATE_USER_SUCCESS
});

const updateUserFailure = code => ({
  type: UserActions.UPDATE_USER_FAILURE,
  code
});

export const changePasswordPending = (
  token,
  password,
  verifyPassword,
  language
) => ({
  type: UserActions.CHANGE_PASSWORD_PENDING,
  token,
  password,
  verifyPassword,
  language
});

const changePasswordSuccess = () => ({
  type: UserActions.CHANGE_PASSWORD_SUCCESS
});

const changePasswordFailure = code => ({
  type: UserActions.CHANGE_PASSWORD_FAILURE,
  code
});

export const updateUserEpic = action$ => {
  return action$.ofType(UserActions.UPDATE_USER_PENDING).pipe(
    mergeMap(action => {
      return ajax({
        url: "https://44c0v.sse.codesandbox.io/update/user/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          token: action.token,
          mail: action.mail,
          firstName: action.firstName,
          lastName: action.lastName,
          photo: action.photo,
          audience: "forked-jiz13"
        }
      }).pipe(
        mergeMap(response => {
          if (response.response.code !== 0) {
            return [
              updateUserFailure(response.response.code),
              show(
                codeToString(response.response.code, null, action.language),
                true,
                Times.NORMAL
              )
            ];
          } else {
            sessionStorage.setItem("token", response.response.token);
            return [
              updateUserSuccess(),
              show(
                action.language.messages.updateUserSuccess,
                false,
                Times.NORMAL
              )
            ];
          }
        }),
        catchError(() => {
          return [
            updateUserFailure(-2),
            show(codeToString(-2, null, action.language), true, Times.NORMAL)
          ];
        })
      );
    })
  );
};

export const changePasswordEpic = action$ => {
  return action$.ofType(UserActions.CHANGE_PASSWORD_PENDING).pipe(
    mergeMap(action => {
      if (action.password.length < 8) {
        return [
          changePasswordFailure(-14),
          show(codeToString(-14, null, action.language), true, Times.NORMAL)
        ];
      } else if (action.password !== action.verifyPassword) {
        return [
          changePasswordFailure(-6),
          show(codeToString(-6, null, action.language), true, Times.NORMAL)
        ];
      } else {
        return ajax({
          url: "https://44c0v.sse.codesandbox.io/update/password",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            token: action.token,
            password: action.password,
            audience: "forked-jiz13"
          }
        }).pipe(
          mergeMap(response => {
            sessionStorage.setItem("token", response.response.token);
            return [
              changePasswordSuccess(),
              show(
                action.language.messages.changePasswordSuccess,
                false,
                Times.NORMAL
              )
            ];
          }),
          catchError(() => {
            return [
              changePasswordFailure(-2),
              show(codeToString(-2, null, action.language), true, Times.NORMAL)
            ];
          })
        );
      }
    })
  );
};
