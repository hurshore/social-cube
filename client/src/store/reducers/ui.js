import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loading: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_TWEET_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_TWEET_SUCCESS:
      return {
        ...state,
        loading: false
      }
    case actionTypes.FETCH_TWEET_FAIL:
      return {
        ...state,
        loading: false
      }
    default: return state;
  }
}

export default reducer;