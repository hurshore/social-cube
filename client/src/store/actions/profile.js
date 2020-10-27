import * as actionTypes from './actionTypes';
import * as actions from './index';

export const fetchProfileDetails = (handle) => {
  return dispatch => {
    dispatch(fetchProfileDetailsStart);
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${handle}`)
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        dispatch(fetchProfileDetailsSuccess(data));
        dispatch(actions.fetchTweetsSuccess(data.tweets));
        // this.props.setTweets(data.tweets);
        console.log(data);
      } else {
        const err = await res.clone().json();
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch(fetchProfileDetailsFail);
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

const fetchProfileDetailsFail = () => {
  return {
    type: actionTypes.FETCH_PROFILE_DETAILS_FAIL
  }
}

export const uploadUserImage = (payload) => {
  return dispatch => {
    const formData = new FormData();
    formData.append('file', payload.image);
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/image', {
      method: 'POST',
      headers: {
        'Authorization': payload.FBIdToken
      },
      body: formData
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(fetchProfileDetails(payload.handle));
        dispatch(actions.getUserData(payload.FBIdToken));
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
        console.log(data);
        dispatch(fetchProfileDetails(payload.handle));
        dispatch(actions.getUserData(payload.FBIdToken));
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        // Update profile
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