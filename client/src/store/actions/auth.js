import * as actionTypes from './actionTypes';
import jwtDecode from 'jwt-decode';

export const auth = (payload) => {
  return async dispatch => {
    dispatch(authStart());
    let url = 'https://europe-west1-socialio-a0744.cloudfunctions.net/api/login';
    let body = {
      email: payload.email,
      password: payload.password
    }

    if(payload.isSignup) {
      url = 'https://europe-west1-socialio-a0744.cloudfunctions.net/api/signup';
      body = {
        fullName: payload.fullName,
        handle: payload.handle,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword
      }
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then((res) => {
      if(!res.ok) {
        return res.clone().json()
        .then((err) => {
          console.log(err);
          throw err;
        })
      } else {
        return res.json()
        .then((data) => {
          dispatch(authSuccess(`Bearer ${data.token}`));
          localStorage.setItem('FBIdToken', `Bearer ${data.token}`);
          payload.history.push('/');
        });
      }
    })
    .catch((err) => {
      console.log(payload);
      console.log(err);
      dispatch(authFail(err));
    })
  }
}

const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token
  }
}

const authFail = (errors) => {
  return {
    type: actionTypes.AUTH_FAIL,
    errors
  }
}

export const clearErrors = () => {
  return {
    type: actionTypes.CLEAR_ERRORS
  }
}

export const checkAuthState = () => {
  return dispatch => {
    const idToken = localStorage.getItem('FBIdToken');
    if(!idToken) {
      dispatch(logout());
    } else {
      const decodedToken = jwtDecode(idToken);
      if(decodedToken.exp * 1000 < Date.now()) {
        dispatch(logout());
        window.location.href = '/login';
      } else {
        dispatch(authSuccess(idToken));
        // store.dispatch(getUserData());
      }
      
    }
  }
}

export const logout = () => {
  localStorage.removeItem('FBIdToken');
  return {
    type: actionTypes.LOGOUT
  }
}