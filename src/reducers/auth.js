import { AUTH, LOGOUT } from '../constants/actionTypes';

import * as actionType from '../constants/actionTypes';


// handle logging in / signing up + logout

const authReducer = (state = { authData: null }, action) => {
  switch (action.type) {
    case AUTH: // previous errors with actionType

      // set user data in LS
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));

      // return user state
      return { ...state, authData: action.data, loading: false, errors: null };
 
    case actionType.LOGOUT:

      // remove user from LS
      localStorage.clear();

      // return state (no user)
      return { ...state, authData: null, loading: false, errors: null };

    default:
      return state;
  }
};

export default authReducer;