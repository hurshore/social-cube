import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

//Components
import PopularTweet from '../../components/PopularTweet/PopularTweet';
import PopularTweetSkeleton from '../../components/PopularTweet/PopularTweetSkeleton';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  ...theme.spreadThis,
  popularTweets: {
    borderRadius: '1rem',
    backgroundColor: theme.spreadThis.customTheme.backgroundColor,
    padding: '1rem',
  },
  heading: {
    fontWeight: 600
  }
})

class popularTweets extends Component {
  componentDidMount() {
    this.props.onFetchPopularTweets();
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.popularTweets}>
        <Typography variant="body1" component="h4" className={classes.heading}>POPULAR POSTS</Typography>
        {
          !this.props.loading ? (
            this.props.popularTweets.map((tweet) => (
              <PopularTweet key={tweet.tweetId}
                tweetId={tweet.tweetId}
                likeCount={tweet.likeCount}
                commentCount={tweet.commentCount}
                userImageUrl={tweet.userImageUrl}
                userHandle={tweet.userHandle}
                createdAt={tweet.createdAt}
              />
            ))
          ) : (
            Array(3).fill().map((item, index) => (
              <PopularTweetSkeleton key={index} />
            ))
          )
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    popularTweets: state.data.popularTweets,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchPopularTweets: () => dispatch(actions.fetchPopularTweets())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(popularTweets));