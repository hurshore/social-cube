import * as actionTypes from '../actions/actionTypes';

const initialState = {
  authenticated: false,
  FBIdToken: null,
  loading: false,
  errors: {}
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.AUTH_START: {
      return {
        ...state,
        loading: true
      }
    }
    case actionTypes.AUTH_SUCCESS: {
      return {
        ...state,
        FBIdToken: action.token,
        authenticated: true,
        loading: false
      }
    }
    case actionTypes.AUTH_FAIL: {
      return {
        ...state,
        loading: false,
        errors: {
          ...action.errors
        }
      }
    }
    case actionTypes.CLEAR_ERRORS: {
      return {
        ...state,
        errors: {}
      }
    }
    case actionTypes.LOGOUT: {
      return initialState;
    }
    default: return state;
  }
}

export default reducer;