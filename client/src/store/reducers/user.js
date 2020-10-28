import * as actionTypes from '../actions/actionTypes';

const initialState = {
  credentials: {},
  followers: [],
  following: [],
  notifications: [],
  likes: [],
  loading: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.GET_USER_DATA_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.GET_USER_DATA_SUCCESS:
      const newState = {
        ...state,
        ...action.payload
      }
      return {
        ...state,
        ...newState,
        loading: false
      }
    case actionTypes.GET_USER_DATA_FAIL:
      return {
        ...state,
        loading: false
      }
    case actionTypes.LIKE_TWEET:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            tweetId: action.payload.tweetId,
            userHandle: action.payload.userHandle
          }
        ]
      }
    case actionTypes.UNLIKE_TWEET:
      return {
        ...state,
        likes: state.likes.filter((like) => like.tweetId !== action.payload.tweetId)
      }
    case actionTypes.FOLLOW_USER_SUCCESS:
      const following = [
        ...state.following,
        action.payload.followHandle
      ]
      return {
        ...state,
        following
      }
    case actionTypes.UNFOLLOW_USER_SUCCESS:
      const newFollowing = state.following.filter((user) => user !== action.payload.unfollowHandle)
      return {
        ...state,
        following: newFollowing
      }
    case actionTypes.NOTIFICATIONS_MARKED_READ:
      const notifications = state.notifications.map((notification) => {
        return {...notification, read: true};
      });
      return {
        ...state,
        notifications
      }
    case actionTypes.UPLOAD_USER_IMAGE_SUCCESS:
      const freshCredentials = {
        ...state.credentials,
        imageUrl: action.payload.imageUrl,
        imageFileName: action.payload.imageFileName
      }
      return {
        ...state,
        credentials: freshCredentials
      }
    case actionTypes.UPLOAD_BACKGROUND_IMAGE_SUCCESS:
      const credentials = {
        ...state.credentials,
        backgroundUrl: action.payload.backgroundUrl,
        backgroundImageFileName: action.payload.backgroundImageFileName
      }
      return {
        ...state,
        credentials: credentials
      }
    default: return state;
  }
}

export default reducer;