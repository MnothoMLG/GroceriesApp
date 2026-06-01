export function loadingReducer(state = {}, action: any) {
  const { type } = action;

  const matches = /(.*)_API_(REQUEST|SUCCESS|ERROR)/.exec(type);

  if (!matches) {
    return state;
  }

  const [, requestName, requestState] = matches;

  return {
    ...state,
    [requestName]: requestState === 'REQUEST',
  };
}
