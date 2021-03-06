import * as actionTypes from '../actions/actionTypes';

const initialState = {
  credentials: {},
  followers: [],
  following: [],
  loading: false,
  errors: {}
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
        credentials: action.payload.user,
        followers: action.payload.followers,
        following: action.payload.following,
        loading: false
      }
    case actionTypes.FETCH_PROFILE_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        errors: action.errors
      }
    case actionTypes.EDIT_PROFILE_DETAILS_SUCCESS:
      const credentials = {
        ...state.credentials,
        bio: action.payload.bio,
        location: action.payload.location,
        website: action.payload.website
      }
      return {
        ...state,
        credentials
      }
    case actionTypes.FOLLOW_USER_SUCCESS:
      const followers = [
        ...state.followers,
        action.payload.followHandle
      ]
      const newCredentials = {
        ...state.credentials,
        followerCount: state.credentials.followerCount + 1
      }
      return {
        ...state,
        credentials: newCredentials,
        followers
      }
    case actionTypes.UNFOLLOW_USER_SUCCESS:
      const newFollowers = [...state.followers];
      const index = newFollowers.indexOf(action.payload.unfollowingHandle);
      newFollowers.splice(index, 1);
      const freshCredentials = {
        ...state.credentials,
        followerCount: state.credentials.followerCount - 1
      }
      return {
        ...state,
        credentials: freshCredentials,
        followers: newFollowers
      }
    case actionTypes.UPLOAD_USER_IMAGE_SUCCESS:
      const newerCredentials = {
        ...state.credentials,
        imageUrl: action.payload.imageUrl,
        imageFileName: action.payload.imageFileName
      }
      return {
        ...state,
        credentials: newerCredentials
      }
    case actionTypes.UPLOAD_BACKGROUND_IMAGE_SUCCESS:
      const fresherCredentials = {
        ...state.credentials,
        backgroundUrl: action.payload.backgroundUrl,
        backgroundImageFileName: action.payload.backgroundImageFileName
      }
      return {
        ...state,
        credentials: fresherCredentials
      }
    default: return state
  }
}

export default reducer;