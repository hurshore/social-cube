//Data actions
export const FETCH_TWEETS_START = 'FETCH_TWEETS_START';
export const FETCH_TWEETS_SUCCESS = 'FETCH_TWEETS_SUCCESS';
export const FETCH_TWEETS_FAIL = 'FETCH_TWEETS_FAIL';
export const FETCH_POPULAR_TWEETS_START = 'FETCH_POPULAR_TWEETS_START';
export const FETCH_POPULAR_TWEETS_SUCCESS = 'FETCH_POPULAR_TWEETS_SUCCESS';
export const FETCH_POPULAR_TWEETS_FAIL = 'FETCH_POPULAR_TWEETS_FAIL';
export const LIKE_TWEET = 'LIKE_TWEET';
export const UNLIKE_TWEET = 'UNLIKE_TWEET';
export const FETCH_TWEET_START = 'FETCH_TWEET_START'; //Fetch single tweet
export const FETCH_TWEET_SUCCESS = 'FETCH_TWEET_SUCCESS';
export const FETCH_TWEET_FAIL = 'FETCH_TWEET_FAIL';
export const CLEAR_TWEET = 'CLEAR_TWEET';
export const POST_COMMENT = 'POST_COMMENT';
// export const POST_TWEET_START = 'POST_TWEET_START';
export const POST_TWEET_SUCCESS = 'POST_TWEET_SUCCESS';
// export const POST_TWEET_FAIL = 'POST_TWEET_FAIL';
export const DELETE_TWEET_SUCCESS = 'DELETE_TWEET_SUCCESS';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const FOLLOW_USER = 'FOLLOW_USER';
export const UNFOLLOW_USER = 'UNFOLLOW_USER';

//Auth actions
export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';
export const CHECK_AUTH_STATE = 'CHECK_AUTH_STATE';
export const LOGOUT = 'LOGOUT';

//User actions
export const GET_USER_DATA_START = 'GET_USER_DATA_START';
export const GET_USER_DATA_SUCCESS = 'GET_USER_DATA_SUCCESS';
export const GET_USER_DATA_FAIL = 'GET_USER_DATA_FAIL';
export const NOTIFICATIONS_MARKED_READ = 'NOTIFICATIONS_MARKED_READ';

//Profile actions
export const FETCH_PROFILE_DETAILS_START = 'FETCH_PROFILE_DETAILS_START';
export const FETCH_PROFILE_DETAILS_SUCCESS = 'FETCH_PROFILE_DETAILS_SUCCESS';
export const FETCH_PROFILE_DETAILS_FAIL = 'FETCH_PROFILE_DETAILS_FAIL';