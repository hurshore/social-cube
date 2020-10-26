import React, { Component } from 'react';
import * as actions from '../../store/actions';

//Redux stuff
import { connect } from 'react-redux';
//Components
import Tweet from '../../components/Tweet/Tweet';
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
          // !this.props.loading ? (
          //   this.props.tweets.map((tweet) => (
          //     <Tweet key={tweet.tweetId}
          //       tweetId={tweet.tweetId}
          //       body={tweet.body}
          //       commentCount={tweet.commentCount}
          //       likeCount={tweet.likeCount}
          //       createdAt={tweet.createdAt}
          //       tweetImageUrl={tweet.tweetImageUrl}
          //       userImageUrl={tweet.userImageUrl}
          //       userHandle={tweet.userHandle}
          //     />
          //   ))
          // ) : <p>Loading..</p>
          this.props.loading ? (
            <p>Loading...</p>
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