import { mergeMap, catchError } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

export const ValidateActions = {
  VALIDATE_PENDING: "VALIDATE_PENDING",
  VALIDATE_SUCCESS: "VALIDATE_SUCCESS",
  VALIDATE_FAILURE: "VALIDATE_FAILURE"
};

export const validatePending = (validation, token) => ({
  type: ValidateActions.VALIDATE_PENDING,
  validation,
  token
});

const validateSuccess = () => ({
  type: ValidateActions.VALIDATE_SUCCESS
});

const validateFailure = code => ({
  type: ValidateActions.VALIDATE_FAILURE,
  code
});

// Return an url for each kind of validation
const getUrlFromValidation = validation => {
  switch (validation) {
    case 0: {
      return "https://44c0v.sse.codesandbox.io/verify/";
    }
    case 1: {
      return "https://44c0v.sse.codesandbox.io/allow/";
    }
    default: {
      return "https://44c0v.sse.codesandbox.io/verify/";
    }
  }
};

export const validateEpic = action$ => {
  return action$.ofType(ValidateActions.VALIDATE_PENDING).pipe(
    mergeMap(action => {
      return ajax({
        url: getUrlFromValidation(action.validation),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
          token: action.token
        }
      }).pipe(
        mergeMap(response => {
          if (response.response.code !== 0) {
            return [validateFailure(response.response.code)];
          } else {
            return [validateSuccess()];
          }
        }),
        catchError(() => {
          return [validateFailure(-2)];
        })
      );
    })
  );
};
