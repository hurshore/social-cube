import React from 'react';

import * as actions from '../../store/actions';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//Components
import TweetDialog from '../Tweet/TweetDialog';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
//Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentIcon from '@material-ui/icons/Comment';

const styles = (theme) => ({
  ...theme.spreadThis,
  tweet: {
    borderRadius: '.8rem',
    margin: '1rem 0',
    padding: '.5rem',
    backgroundColor: theme.spreadThis.customTheme.secondaryBackgroundColor
  },
  cardHeader: {
    padding: '.5rem 1rem'
  },
  cardFooter: {
    padding: '0 .5rem'
  },
  liked: {
    color: 'red'
  }
})

const popularTweet = (props) => {
  const { classes } = props;
  dayjs.extend(relativeTime);

  const likeTweet = (tweetId) => {
    props.likeTweet(tweetId, props.FBIdToken);
  }

  const unlikeTweet = (tweetId) => {
    props.unlikeTweet(tweetId, props.FBIdToken);
  }

  const liked = props.likes.find((like) => {
    return like.tweetId === props.tweetId;
  })

  const redirectToUser = () => {
    props.history.push(`/users/${props.userHandle}`);
  }

  return (
    <Card className={classes.tweet}>
      <CardHeader
        className={classes.cardHeader}
        avatar={
          <Avatar src={props.userImageUrl} alt="user" onClick={redirectToUser} />
        }
        title={
          <Typography onClick={redirectToUser}>{props.userHandle}</Typography>
        }
        subheader={dayjs(props.createdAt).fromNow()}
      />
      <CardActions disableSpacing className={classes.cardFooter}>
        <div>
          {liked ?
            <IconButton onClick={() => unlikeTweet(props.tweetId)}>
              <FavoriteIcon className={classes.liked} />
            </IconButton> :
            <IconButton onClick={() => likeTweet(props.tweetId)}>
              <FavoriteBorderIcon /> 
            </IconButton>
          }
          {props.likeCount !== 1 ? `${props.likeCount} likes` : `${props.likeCount} like`}
        </div>
        <div>
          <IconButton aria-label="share">
            <CommentIcon />
          </IconButton>
          {props.commentCount !== 1 ? `${props.commentCount} comments` : `${props.commentCount} comment`}
        </div>
        <TweetDialog tweetId={props.tweetId} />
      </CardActions>
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    likes: state.user.likes,
    FBIdToken: state.auth.FBIdToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    likeTweet: (tweetId, FBIdToken) => dispatch(actions.likeTweet(tweetId, FBIdToken)),
    unlikeTweet: (tweetId, FBIdToken) => dispatch(actions.unlikeTweet(tweetId, FBIdToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(popularTweet)));