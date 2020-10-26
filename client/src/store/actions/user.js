import * as actionTypes from './actionTypes';

export const getUserData = (FBIdToken) => {
  return dispatch => {
    dispatch(getUserDataStart());
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user', {
      headers: {
        'Authorization': FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(getUserDataSuccess(data)); 
      } else {
        const err = await res.clone().json();
        console.log(err);
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

export const followUser = (handle) => {
  return {
    type: actionTypes.FOLLOW_USER,
    payload: {
      handle
    }
  }
}

export const unfollowUser = (handle) => {
  return {
    type: actionTypes.UNFOLLOW_USER,
    payload: {
      handle
    }
  }
}

export const markUnreadNotifications = (notificationIds, FBIdToken) => {
  console.log(notificationIds);
  return dispatch => {
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/notifications', {
      method: 'POST',
      headers: {
        'Authorization': FBIdToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notificationIds)
    })
    .then(async (res) => {
      if(res.ok) {
        console.log('Got here');
        const data = await res.json();
        console.log(data);
        dispatch(notificationsMarkedRead()); 
      } else {
        const err = await res.clone().json();
        console.log(err);
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

export const uploadUserImage = (image, FBIdToken) => {
  const formData = new FormData();
  formData.append('file', image);
  return dispatch => {
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/image', {
      method: 'POST',
      headers: {
        'Authorization': FBIdToken
      },
      body: formData
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(getUserData(FBIdToken));
      } else {
        const err = await res.clone().json();
        throw err;
      }
    })
    .catch((err) => {
      console.log(err)
    })
  }
}