import * as actionTypes from './actionTypes';

export const getUserData = (FBIdToken) => {
  return dispatch => {
    dispatch(getUserDataStart());
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user', {
      headers: {
        'Authorization': FBIdToken,
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        dispatch(getUserDataSuccess(data)); 
      } else {
        const err = await res.clone().json();
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch(getUserDataFail());
    })
  }
}

const getUserDataStart = () => {
  return {
    type: actionTypes.GET_USER_DATA_START
  }
}

const getUserDataSuccess = (data) => {
  return {
    type: actionTypes.GET_USER_DATA_SUCCESS,
    payload: data
  }
}

const getUserDataFail = () => {
  return {
    type: actionTypes.GET_USER_DATA_FAIL
  }
}

export const followUser = (payload) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${payload.followHandle}/follow`, {
      headers: {
        'Authorization': payload.FBIdToken,
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(async (res) => {
      if(res.ok) {
        // const data = await res.json();
        dispatch(followUserSuccess({
          followingHandle: payload.followingHandle,
          followHandle: payload.followHandle
        }));
      } else {
        const err = await res.clone().json();
        throw err;
      }
      
    })
    .catch((err) => {
      console.log(err);
    })
  }
}

export const followUserSuccess = (payload) => {
  return {
    type: actionTypes.FOLLOW_USER_SUCCESS,
    payload
  }
}

export const  unfollowUser = (payload) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${payload.unfollowHandle}/unfollow`, {
      headers: {
        'Authorization': payload.FBIdToken,
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(async (res) => {
      if(res.ok) {
        // const data = await res.json();
        dispatch(unfollowUserSuccess({
          unfollowingHandle: payload.unfollowingHandle,
          unfollowHandle: payload.unfollowHandle
        }));
      } else {
        const err = await res.clone().json();
        throw err;
      }
      
    })
    .catch((err) => {
      console.log(err);
    })
  }
}

export const unfollowUserSuccess = (payload) => {
  return {
    type: actionTypes.UNFOLLOW_USER_SUCCESS,
    payload
  }
}

export const markUnreadNotifications = (notificationIds, FBIdToken) => {
  return dispatch => {
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/notifications', {
      method: 'POST',
      headers: {
        'Authorization': FBIdToken,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(notificationIds)
    })
    .then(async (res) => {
      if(res.ok) {
        // const data = await res.json();
        dispatch(notificationsMarkedRead()); 
      } else {
        const err = await res.clone().json();
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
    })
  }
}

const notificationsMarkedRead = () => {
  return {
    type: actionTypes.NOTIFICATIONS_MARKED_READ
  }
}