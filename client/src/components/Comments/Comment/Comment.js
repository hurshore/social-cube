import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';
import { Link } from 'react-router-dom';
//dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
//Components
import CustomButton from '../../UI/CustomButton/CustomButton';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
// import Link from '@material-ui/core/Link'
//Icons
import DeleteIcon from '@material-ui/icons/Delete';

const styles = (theme) => ({
  ...theme.spreadThis,
  comment: {
    padding: '.5rem .8rem',
    position: 'relative',
    '&:last-child hr': {
      display: 'none'
    }
  },
  imageBox: {
    float: 'left'
  },
  imageContainer: {
    width: '40px',
    height: '40px',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '50%'
    }
  },
  handle: {
    fontWeight: 600
  },
  commentDetails: {
    display: 'inline-block',
    paddingLeft: '1rem'
  },
  commentBody: {
    marginLeft: '57px'
  },
  timestamp: {
    fontSize: '.8rem'
  },
  delete: {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'red'
  },
  link: {
    color: '#1976d2'
  }
})

const comment = (props) => {
  const { classes, comment: { imageUrl, userHandle, body, createdAt, tweetId, commentId }, credentials } = props;
  dayjs.extend(relativeTime);

  const deleteComment = (tweetId, commentId) => {
    props.onDeleteComment({
      tweetId,
      commentId,
      FBIdToken: props.FBIdToken
    })
  }

  return (
    <div className={classes.comment}>
      <div className={classes.imageBox}>
        <div className={classes.imageContainer}>
          <Link to={`/users/${userHandle}`}>
            <img src={imageUrl} alt="user" />
          </Link>
        </div>
      </div>
      <div className={classes.commentDetails}>
        <Link to={`/users/${userHandle}`} className={classes.link}>
          <Typography variant="body1" className={classes.handle}>{userHandle}</Typography>
        </Link>
        <Typography className={classes.timestamp}>{dayjs(createdAt).fromNow()}</Typography>
      </div>
      <Typography variant="body2" className={classes.commentBody}>{body}</Typography>
      <Divider />
      {
        userHandle === credentials.handle ? 
        <CustomButton btnClassName={classes.delete} title="Delete comment" clicked={() => deleteComment(tweetId, commentId)}>
          <DeleteIcon />
        </CustomButton> : null
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    credentials: state.user.credentials,
    FBIdToken: state.auth.FBIdToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteComment: (payload) => dispatch(actions.deleteComment(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(comment));