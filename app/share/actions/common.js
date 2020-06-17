import { ACTION_TYPE } from '../../constants/action/common';

export const updateAppLoadingCompleted = (data) => ({
  type: ACTION_TYPE.APP_LOADING_COMPLETED,
  payload: { data },
});

export const updateAuthLoadingCompleted = (data) => ({
  type: ACTION_TYPE.AUTH_LOADING_COMPLETED,
  payload: { data },
});

export const updateAuth = (data) => ({
  type: ACTION_TYPE.IS_AUTH,
  payload: { data },
});
