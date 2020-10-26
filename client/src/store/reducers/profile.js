import * as actionTypes from '../actions/actionTypes';

const initialState = {
  profile: {},
  followers: [],
  following: [],
  loading: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_PROFILE_DETAILS_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_PROFILE_DETAILS_SUCCESS:
      return {
        ...state,
        profile: action.payload.user,
        followers: action.payload.followers,
        following: action.payload.following,
        loading: false
      }
    case actionTypes.FETCH_PROFILE_DETAILS_FAIL:
      return {
        ...state,
        loading: false
      }
    default: return state
  }
}

export default reducer;