import * as actionTypes from './actionTypes';

export const fetchProfileDetails = (handle) => {
  return dispatch => {
    dispatch(fetchProfileDetailsStart);
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${handle}`)
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        dispatch(fetchProfileDetailsSuccess(data));
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