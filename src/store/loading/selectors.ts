type LoadingState = {
  loadingReducer?: Record<string, boolean>;
};

export const createLoadingSelector =
  (actions: string[] = []) =>
  (state: LoadingState) => {
    if (!actions.length) {
      return Object.values(state.loadingReducer || {}).some(Boolean);
    }

    return actions.some((action) => Boolean(state.loadingReducer?.[action]));
  };
