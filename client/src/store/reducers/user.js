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
      // return {
      //   ...state,
      //   credentials: action.payload.credentials,
      //   followers: action.payload.followers,
      //   following: action.payload.following,
      //   notifications: action.payload.notifications,
      //   likes: action.payload.likes,
      //   loading: false
      // }
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
    case actionTypes.FOLLOW_USER:
      console.log(action.payload);
      const following = [
        ...state.following,
        action.payload.handle
      ]
      return {
        ...state,
        following
      }
    case actionTypes.UNFOLLOW_USER:
      console.log(action.payload)
      const newFollowing = state.following.filter((user) => user !== action.payload.handle)
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
    default: return state;
  }
}

export default reducer;