import React, { useState, useRef } from 'react';

import * as actions from '../../store/actions';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//Components
import TweetDialog from './TweetDialog';
import CustomSnackbar from '../UI/CustomSnackbar/CustomSnackbar';
import DeleteDialog from '../DeleteDialog/DeleteDialog';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CommentIcon from '@material-ui/icons/Comment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const styles = (theme) => ({
  ...theme.spreadThis,
  tweet: {
    marginTop: '1.2rem',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: theme.spreadThis.customTheme.backgroundColor,
    borderRadius: '.8rem',
    '&:first-child': {
      marginTop: 0
    },
    // ['@media (min-width: 860px)']: {
    //   maxWidth: '100%'
    // }
  },
  media: {
    height: '56.25%',
  },
  body: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  cardFooter: {
    padding: '.4rem'
  },
  liked: {
    color: 'red'
  },
  clipboard: {
    position: 'fixed',
    transform: 'translateY(-1500px)'
  }
})

const Tweet = (props) => {
  const { classes } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const textAreaRef = useRef(null);
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const copyToClipboard = () => {
    textAreaRef.current.select();
    document.execCommand('copy');
    handleClose();
    snackbarOpenHandler();
  }

  const snackbarOpenHandler = () => {
    setSnackbarOpen(true);
  }

  const snackbarCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  }

  const deleteDialogOpenHandler = () => {
    setAnchorEl(null);
    setDeleteDialogOpen(true);
  }

  const deleteDialogCloseHandler = () => {
    setDeleteDialogOpen(false);
  }

  const deleteTweet = (tweetId) => {
    props.deleteTweet(tweetId, props.FBIdToken);
    setDeleteDialogOpen(false);
  }

  const redirectToUser = () => {
    props.history.push(`/users/${props.userHandle}`)
  }

  return (
    <Card className={classes.tweet}>
      <CardHeader
        avatar={
          <Avatar src={props.userImageUrl} alt="user" onClick={redirectToUser} />
        }
        action={
          <IconButton aria-label="settings"  onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography onClick={redirectToUser}>{props.userHandle}</Typography>
        }
        subheader={dayjs(props.createdAt).fromNow()}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={copyToClipboard}>Copy link</MenuItem>
        {props.credentials.handle === props.userHandle ? 
          <MenuItem onClick={deleteDialogOpenHandler}>Delete tweet</MenuItem> : null
        }
        <form className={classes.clipboard}>
          <textarea ref={textAreaRef} value={`${document.location.host}/users/${props.userHandle}/tweet/${props.tweetId}`} onChange={function(){}} />
        </form>
      </Menu>
      <CardMedia
        className={classes.media}
        image={props.tweetImageUrl}
        title="tweet image"
        component="img"
        height="250"
      />
      <CardContent>
        <Typography variant="body2" component="p" className={classes.body}>
          {props.body}
        </Typography>
      </CardContent>
      <hr />
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
        <TweetDialog tweetBody={props.body} tweetId={props.tweetId} userHandle={props.userHandle} openDialog={props.openDialog} />
      </CardActions>
      <CustomSnackbar open={snackbarOpen} clicked={snackbarCloseHandler} message="Link copied to clipboard" />
      <DeleteDialog open={deleteDialogOpen} 
        onOpen={deleteDialogOpenHandler} 
        onClose={deleteDialogCloseHandler} 
        delete={() => deleteTweet(props.tweetId)}  
      />
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    likes: state.user.likes,
    FBIdToken: state.auth.FBIdToken,
    credentials: state.user.credentials
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    likeTweet: (tweetId, FBIdToken) => dispatch(actions.likeTweet(tweetId, FBIdToken)),
    unlikeTweet: (tweetId, FBIdToken) => dispatch(actions.unlikeTweet(tweetId, FBIdToken)),
    deleteTweet: (tweetId, FBIdToken) => dispatch(actions.deleteTweet(tweetId, FBIdToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Tweet)));