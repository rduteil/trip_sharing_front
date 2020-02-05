import { mergeMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

import { show } from "../../commons/actions/toast";
import { codeToString } from "../../helpers/strings";
import { Times } from "../../helpers/enums";

export const ResetActions = {
  SET_RESET_PENDING: "SET_RESET_PENDING",
  SET_RESET_SUCCESS: "SET_RESET_SUCCESS",
  SET_RESET_FAILURE: "SET_RESET_FAILURE"
};

export const setResetPending = (
  cipher,
  password,
  verifyPassword,
  language
) => ({
  type: ResetActions.SET_RESET_PENDING,
  cipher,
  password,
  verifyPassword,
  language
});

const setResetSuccess = () => ({
  type: ResetActions.SET_RESET_SUCCESS
});

const setResetFailure = code => ({
  type: ResetActions.SET_RESET_FAILURE,
  code
});

export const setResetEpic = action$ => {
  return action$.ofType(ResetActions.SET_RESET_PENDING).pipe(
    mergeMap(action => {
      if (action.password.length < 8) {
        return [
          setResetFailure(-14),
          show(codeToString(-14, null, action.language), true, Times.NORMAL)
        ];
      } else if (action.password !== action.verifyPassword) {
        return [
          setResetFailure(-6),
          show(codeToString(-6, null, action.language), true, Times.NORMAL)
        ];
      } else {
        return ajax({
          url: "https://44c0v.sse.codesandbox.io/reset/set",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            cipher: action.cipher,
            password: action.password,
            audience: "forked-jiz13"
          }
        }).pipe(
          mergeMap(response => {
            if (response.response.code !== 0) {
              return [
                setResetFailure(response.response.code),
                show(
                  codeToString(response.response.code, null, action.language),
                  true,
                  Times.NORMAL
                )
              ];
            } else {
              return [
                setResetSuccess(),
                show(
                  action.language.messages.changePasswordSuccess,
                  false,
                  Times.NORMAL
                )
              ];
            }
          }),
          catchError(() => {
            return [
              setResetFailure(-2),
              show(codeToString(-2, null, action.language), true, Times.NORMAL)
            ];
          })
        );
      }
    })
  );
};
