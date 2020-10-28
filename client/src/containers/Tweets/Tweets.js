import React, { Component } from 'react';

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
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.data.loading
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Tweets));