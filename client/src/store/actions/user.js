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

export const followUser = (payload) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${payload.followHandle}/follow`, {
      headers: {
        'Authorization': payload.FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
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
        'Authorization': payload.FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
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

// export const uploadUserImage = (image, FBIdToken) => {
//   const formData = new FormData();
//   formData.append('file', image);
//   return dispatch => {
//     fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/image', {
//       method: 'POST',
//       headers: {
//         'Authorization': FBIdToken
//       },
//       body: formData
//     })
//     .then(async (res) => {
//       if(res.ok) {
//         const data = await res.json();
//         console.log(data);
//         dispatch(getUserData(FBIdToken));
//       } else {
//         const err = await res.clone().json();
//         throw err;
//       }
//     })
//     .catch((err) => {
//       console.log(err)
//     })
//   }
// }