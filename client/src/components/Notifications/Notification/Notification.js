import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { withRouter } from 'react-router-dom';
//MUI Icons
import CommentIcon from '@material-ui/icons/Comment';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
  notification: {
    display: 'flex',
    padding: '.8rem',
    backgroundColor: theme.palette.type === 'dark' ? '#252525': '#d8d8d8',
    margin: '.2rem .4rem'
  },
  read: {
    backgroundColor: '#79797966'
  },
  favoriteIcon: {
    color: 'red'
  },
  personIcon: {
    color: '#8d14b3'
  },
  message: {
    display: 'flex',
    '& svg': {
      marginRight: '.3rem'
    }
  }
})

const notification = (props) => {
  const { classes } = props;
  dayjs.extend(relativeTime);
  let attachedClasses = [classes.notification];
  if(props.read) {
    attachedClasses = [classes.notification, classes.read]
  }
  
  const notificationClickHandler = (event, tweetId, recipient, sender) => {
    switch(event.target.id) {
      case 'like':
      case 'comment':
        props.history.push(`/users/${recipient}/tweet/${tweetId}`);
        break;
      case 'follow':
        props.history.push(`/users/${sender}`);
        break;
      default: return;
    }
  }

  return (
    <div className={attachedClasses.join(' ')}>
      {
        props.type === 'like' ? (
          <Typography id="like" 
          variant="body1" 
          className={classes.message}
          onClick={(event) => notificationClickHandler(event, props.tweetId, props.recipient)}>
            <FavoriteIcon className={classes.favoriteIcon} />
            {`${props.sender} liked your tweet ${dayjs(props.createdAt).fromNow()}`}
          </Typography>
        ) : props.type === 'comment' ? (
          <Typography id="comment"
          variant="body1" 
          className={classes.message}
          onClick={(event) => notificationClickHandler(event, props.tweetId, props.recipient)}>
            <CommentIcon color="primary" className={classes.commentIcon} />
            {`${props.sender} commented on your tweet ${dayjs(props.createdAt).fromNow()}`}
          </Typography>
        ) : (
          <Typography id="follow" 
          variant="body1" 
          className={classes.message} 
          onClick={(event) => notificationClickHandler(event, null, null, props.sender)}>
            <PersonAddIcon className={classes.personIcon} />
            {`${props.sender} followed you ${dayjs(props.createdAt).fromNow()}`}
          </Typography>
        )
      }
    </div>
  )
}

export default withStyles(styles)(withRouter(notification));