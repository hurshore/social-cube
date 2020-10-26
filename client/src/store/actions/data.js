import * as actionTypes from './actionTypes';

//Fetch Tweets
export const fetchTweets = () => {
  return dispatch => {
    dispatch(fetchTweetsStart());
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweets')
      .then((res) => {
        return res.json();
      })
      .then((tweets) => {
        console.log(tweets);
        dispatch(fetchTweetsSuccess(tweets));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchTweetsFail);
      })
  }
}

const fetchTweetsStart = () => {
  return {
    type: actionTypes.FETCH_TWEETS_START
  }
}

export const fetchTweetsSuccess = (fetchedTweets) => {
  return {
    type: actionTypes.FETCH_TWEETS_SUCCESS,
    tweets: fetchedTweets
  }
}

const fetchTweetsFail = () => {
  return {
    type: actionTypes.FETCH_TWEETS_FAIL
  }
}

//Fetch single tweet
export const fetchTweet = (tweetId) => {
  return dispatch => {
    dispatch(fetchTweetStart());
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet/${tweetId}`)
      .then(async (res) => {
        if(res.ok) {
          const data = await res.json();
          console.log('The tweet', data);
          dispatch(fetchTweetSuccess(data));
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

const fetchTweetStart = () => {
  return {
    type: actionTypes.FETCH_TWEET_START
  }
}

const fetchTweetSuccess = (data) => {
  return {
    type: actionTypes.FETCH_TWEET_SUCCESS,
    payload: data
  }
}

// const fetchTweetFail = () => {
//   return {
//     type: actionTypes.FETCH_TWEET_FAIL
//   }
// }

//Fetch Popular Tweets
export const fetchPopularTweets = () => {
  return dispatch => {
    dispatch(fetchPopularTweetsStart());
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweets/popular')
      .then((res) => {
        return res.json();
      })
      .then((popularTweets) => {
        dispatch(fetchPopularTweetsSuccess(popularTweets));
      })
      .catch((err) => {
        console.log(err);
        dispatch(fetchPopularTweetsFail());
      })
  }
}

const fetchPopularTweetsStart = () => {
  return {
    type: actionTypes.FETCH_POPULAR_TWEETS_START
  }
}

const fetchPopularTweetsSuccess = (fetchedPopularTweets) => {
  return {
    type: actionTypes.FETCH_POPULAR_TWEETS_SUCCESS,
    popularTweets: fetchedPopularTweets
  }
}

const fetchPopularTweetsFail = () => {
  return {
    type: actionTypes.FETCH_POPULAR_TWEETS_FAIL
  }
}

export const likeTweet = (tweetId, FBIdToken) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet/${tweetId}/like`, {
      headers: {
        'Authorization': FBIdToken
      }
    })
      .then(async (res) => {
        if(res.ok) {
          const data = await res.json();
          console.log(data);
          dispatch(likeTweetSuccess(data));
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

const likeTweetSuccess = (data) => {
  return {
    type: actionTypes.LIKE_TWEET,
    payload: data
  }
}

export const unlikeTweet = (tweetId, FBIdToken) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet/${tweetId}/unlike`, {
      headers: {
        'Authorization': FBIdToken
      }
    })
      .then(async (res) => {
        if(res.ok) {
          const data = await res.json();
          dispatch(unlikeTweetSuccess(data));
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

const unlikeTweetSuccess = (data) => {
  return {
    type: actionTypes.UNLIKE_TWEET,
    payload: data
  }
}

export const clearTweet = () => {
  return {
    type: actionTypes.CLEAR_TWEET
  }
}

export const postComment = (data) => {
  return {
    type: actionTypes.POST_COMMENT,
    payload: data
  }
}

export const postTweet = (payload) => {
  console.log(payload);
  return dispatch => {
    var tweetData = new FormData();
    tweetData.append('body', payload.body.trim());
    tweetData.append('file', payload.picture);
    fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet', {
      method: 'POST',
      headers: {
        'Authorization': payload.FBIdToken
      },
      body: tweetData
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log('New tweet', data);
        dispatch(postTweetSuccess(data));
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

// const postTweetStart = () => {
//   return {
//     type: actionTypes.POST_TWEET_START
//   }
// }

const postTweetSuccess = (data) => {
  return {
    type: actionTypes.POST_TWEET_SUCCESS,
    payload: data
  }
}

// const postTweetFail = () => {
//   return {
//     type: actionTypes.POST_TWEET_FAIL
//   }
// }

export const deleteTweet = (tweetId, FBIdToken) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet/${tweetId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(deleteTweetSuccess(tweetId));
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

const deleteTweetSuccess = (tweetId) => {
  return {
    type: actionTypes.DELETE_TWEET_SUCCESS,
    payload: {
      tweetId
    }
  }
}

export const deleteComment = (payload) => {
  return dispatch => {
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet/${payload.tweetId}/comment/${payload.commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': payload.FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        dispatch(deleteCommentSuccess({
          tweetId: payload.tweetId,
          commentId: payload.commentId
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

const deleteCommentSuccess = (payload) => {
  return {
    type: actionTypes.DELETE_COMMENT_SUCCESS,
    payload
  }
}