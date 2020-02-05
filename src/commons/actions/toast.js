export const ToastActions = {
  HIDE: "HIDE",
  SHOW: "SHOW"
};

export const hide = () => ({
  type: ToastActions.HIDE
});

export const show = (message, error, time) => ({
  type: ToastActions.SHOW,
  message,
  error,
  time
});
