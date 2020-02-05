export const RootActions = {
  LOAD_USER: "LOAD_USER"
};

export const loadUser = user => ({
  type: RootActions.LOAD_USER,
  user
});
