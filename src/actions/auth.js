import { AUTH } from '../constants/actionTypes';
import * as api from '../api/index.js';

// what happens on signin
export const signin = (formData, router, setbadLogin) => async (dispatch) => {
  try {
    // send form data to server
    const { data } = await api.signIn(formData);

    // are the credentials right?
    dispatch({ type: AUTH, data });

    // go to posts page
    router('/');
    
  } catch (error) {
    console.log(error);
    setbadLogin(true);
  }
};

// what happens on signup
export const signup = (formData, router, setbadSignUp) => async (dispatch) => {
  try {

    // send form data to server
    const { data } = await api.signUp(formData);


    // check if user exists
    dispatch({ type: AUTH, data });

    // go back to posts homepage
    
    router('/');
  } catch (error) {
    console.log(error);
    setbadSignUp(true);
  }
};