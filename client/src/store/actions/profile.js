import * as actionTypes from './actionTypes';
import * as actions from './index';

export const fetchProfileDetails = (handle) => {
  return dispatch => {
    dispatch(actions.clearTweets());
    dispatch(fetchProfileDetailsStart());
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${handle}`, {
      'Access-Control-Allow-Origin': '*'
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        dispatch(fetchProfileDetailsSuccess(data));
        dispatch(actions.fetchTweetsSuccess(data.tweets));
      } else {
        const err = await res.clone().json();
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch(fetchProfileDetailsFail({
        user: err.error
      }));
    })
  }
}

const fetchProfileDetailsStart = () => {
  return {
    type: actionTypes.FETCH_PROFILE_DETAILS_START
  }
}

const fetchProfileDetailsSuccess = (data) => {
  return {
    type: actionTypes.FETCH_PROFILE_DETAILS_SUCCESS,
    payload: data
  }
}

const fetchProfileDetailsFail = (errors) => {
  return {
    type: actionTypes.FETCH_PROFILE_DETAILS_FAIL,
    errors
  }
}

export const uploadUserImage = (payload) => {
  return dispatch => {
    const formData = new FormData();
    formData.append('file', payload.image);
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/image', {
      method: 'POST',
      headers: {
        'Authorization': payload.FBIdToken,
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        // dispatch(fetchProfileDetails(payload.handle));
        // dispatch(actions.getUserData(payload.FBIdToken));
        dispatch(uploadUserImageSuccess(data));
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

const uploadUserImageSuccess = (data) => {
  return {
    type: actionTypes.UPLOAD_USER_IMAGE_SUCCESS,
    payload: data
  }
}

export const uploadBackgroundImage = (payload) => {
  return dispatch => {
    const formData = new FormData();
    formData.append('file', payload.image);
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/background-image', {
      method: 'POST',
      headers: {
        'Authorization': payload.FBIdToken,
        'Access-Control-Allow-Origin': '*'
      },
      body: formData
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        // dispatch(fetchProfileDetails(payload.handle));
        // dispatch(actions.getUserData(payload.FBIdToken));
        dispatch(uploadBackgroundImageSuccess(data));
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

const uploadBackgroundImageSuccess = (data) => {
  return {
    type: actionTypes.UPLOAD_BACKGROUND_IMAGE_SUCCESS,
    payload: data
  }
}

export const editProfileDetails = (payload) => {
  const body = {
    bio: payload.bio,
    location: payload.location,
    website: payload.website
  }
  return dispatch => {
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user', {
      method: 'POST',
      headers: {
        'Authorization': payload.FBIdToken,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(body)
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        dispatch(editProfileDetailsSuccess(data.details));
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

const editProfileDetailsSuccess = (data) => {
  return {
    type: actionTypes.EDIT_PROFILE_DETAILS_SUCCESS,
    payload: data
  }
}