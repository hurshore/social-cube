import React, { Component } from 'react';
import * as actions from '../../store/actions';

//Redux stuff
import { connect } from 'react-redux';
//Components
import Tweet from '../../components/Tweet/Tweet';
import TweetSkeleton from '../../components/Tweet/TweetSkeleton';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
})

class Tweets extends Component {
  componentDidMount() {
    this.props.onFetchTweets();
  }

  render() {
    return (
      <React.Fragment>
        {
          this.props.loading ? (
            Array(4).fill().map((item, index) => (
              <TweetSkeleton key={index} />
            ))
          ) : !this.props.tweetIdParam ? (
            this.props.tweets.map((tweet) => (
              <Tweet key={tweet.tweetId}
                tweetId={tweet.tweetId}
                body={tweet.body}
                commentCount={tweet.commentCount}
                likeCount={tweet.likeCount}
                createdAt={tweet.createdAt}
                tweetImageUrl={tweet.tweetImageUrl}
                userImageUrl={tweet.userImageUrl}
                userHandle={tweet.userHandle}
              />
            ))
          ) : this.props.tweets.map((tweet) => {
            if(tweet.tweetId !== this.props.tweetIdParam) {
              return (
                <Tweet key={tweet.tweetId}
                  tweetId={tweet.tweetId}
                  body={tweet.body}
                  commentCount={tweet.commentCount}
                  likeCount={tweet.likeCount}
                  createdAt={tweet.createdAt}
                  tweetImageUrl={tweet.tweetImageUrl}
                  userImageUrl={tweet.userImageUrl}
                  userHandle={tweet.userHandle}
                />
              )
            } else {
              return (
                <Tweet key={tweet.tweetId}
                  tweetId={tweet.tweetId}
                  body={tweet.body}
                  commentCount={tweet.commentCount}
                  likeCount={tweet.likeCount}
                  createdAt={tweet.createdAt}
                  tweetImageUrl={tweet.tweetImageUrl}
                  userImageUrl={tweet.userImageUrl}
                  userHandle={tweet.userHandle}
                  openDialog
                />
              )
            }
          })
        }
      </React.Fragment>
      // <React.Fragment>
      //   <TweetSkeleton />
      // </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    tweets: state.data.tweets,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTweets: () => dispatch(actions.fetchTweets())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Tweets));