import { ACTION_TYPE } from '../../constants/action/common';

let dataState = {
  appLoadingComplete: false,
  authLoadingComplete: false,
  isAuth: false,
};

const commonReducer = (state = dataState, action) => {
  switch (action.type) {
    case ACTION_TYPE.APP_LOADING_COMPLETED:
      return { ...state, appLoadingComplete: action.payload.data };
    case ACTION_TYPE.AUTH_LOADING_COMPLETED:
      return { ...state, authLoadingComplete: action.payload.data };
    case ACTION_TYPE.IS_AUTH:
      return { ...state, isAuth: action.payload.data };
    default:
      return state;
  }
};

export default commonReducer;
