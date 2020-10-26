import * as actionTypes from '../actions/actionTypes';

const initialState = {
  tweets: [],
  tweet: {},
  popularTweets: [],
  loading: false
}

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case actionTypes.FETCH_TWEETS_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_TWEETS_SUCCESS:
      return {
        ...state,
        tweets: action.tweets,
        loading: false
      }
    case actionTypes.FETCH_TWEETS_FAIL:
      return {
        ...state,
        loading: false
      }
    case actionTypes.FETCH_TWEET_SUCCESS:
      return {
        ...state,
        tweet: action.payload,
        loading: false
      }
    case actionTypes.FETCH_POPULAR_TWEETS_START:
      return {
        ...state,
        loading: true
      }
    case actionTypes.FETCH_POPULAR_TWEETS_SUCCESS:
      return {
        ...state,
        popularTweets: action.popularTweets,
        loading: false
      }
    case actionTypes.FETCH_POPULAR_TWEETS_FAIL:
      return {
        ...state,
        loading: false
      }
    case actionTypes.LIKE_TWEET:
    case actionTypes.UNLIKE_TWEET:
      let tweets = state.tweets.map((tweet) => tweet.tweetId !== action.payload.tweetId ? 
        tweet : { ...tweet, ...action.payload }
      )
      const popularTweets = state.popularTweets.map((tweet) => tweet.tweetId !== action.payload.tweetId ? 
        tweet : { ...tweet, ...action.payload }
      )
      return {
        ...state,
        tweets,
        popularTweets
      }
    case actionTypes.CLEAR_TWEET:
      return {
        ...state,
        tweet: {}
      }
    case actionTypes.POST_COMMENT:
      console.log(action.payload);
      const newTweets = state.tweets.map((tweet) => tweet.tweetId !== action.payload.tweetId ? 
        tweet : { ...tweet, commentCount: tweet.commentCount + 1 }
      )
      const tweet = {
        ...state.tweet,
        comments: [
          ...state.tweet.comments,
          {
            body: action.payload.body,
            createdAt: action.payload.createdAt,
            imageUrl: action.payload.imageUrl,
            userHandle: action.payload.userHandle,
            tweetId: action.payload.tweetId
          }
        ]
      }
      return {
        ...state,
        tweets: newTweets,
        tweet
      }
    case actionTypes.POST_TWEET_SUCCESS:
      console.log(action.payload);
      const freshTweets = [
        {...action.payload},
        ...state.tweets
      ]
      return {
        ...state,
        tweets: freshTweets
      }
    case actionTypes.DELETE_TWEET_SUCCESS:
      const recentTweets = state.tweets.filter((tweet) => tweet.tweetId !== action.payload.tweetId);
      return {
        ...state,
        tweets: recentTweets
      }
    case actionTypes.DELETE_COMMENT_SUCCESS:
      const newerTweets = state.tweets.map((tweet) => tweet.tweetId !== action.payload.tweetId ? 
        tweet : { ...tweet, commentCount: tweet.commentCount - 1 }
      )
      const newTweetComments = state.tweet.comments.filter((comment) => comment.commentId !== action.payload.commentId);
      const newTweet = {
        ...state.tweet,
        comments: newTweetComments
      }
      return {
        ...state,
        tweets: newerTweets,
        tweet: newTweet
      }
    default: return state;
  }
}

export default reducer;