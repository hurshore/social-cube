import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
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
    marginBottom: '.1rem'
  },
  message: {
    paddingLeft: '.5rem'
  },
  read: {
    backgroundColor: '#79797966'
  },
  favoriteIcon: {
    color: 'red'
  },
  personIcon: {
    color: '#8d14b3'
  }
})

const notification = (props) => {
  const { classes } = props;
  dayjs.extend(relativeTime);
  let attachedClasses = [classes.notification];
  if(props.read) {
    attachedClasses = [classes.notification, classes.read]
  }

  return (
    <div className={attachedClasses.join(' ')}>
      {
        props.type === 'like' ? (
          <React.Fragment>
            <FavoriteIcon className={classes.favoriteIcon} />
            <Typography variant="body1" className={classes.message}>{`${props.sender} liked your tweet ${dayjs(props.createdAt).fromNow()}`}</Typography>
          </React.Fragment>
        ) : props.type === 'comment' ? (
          <React.Fragment>
            <CommentIcon color="primary" />
            <Typography variant="body1" className={classes.message}>{`${props.sender} commented on your tweet ${dayjs(props.createdAt).fromNow()}`}</Typography>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <PersonAddIcon className={classes.personIcon} />
            <Typography variant="body1" className={classes.message}>{`${props.sender} followed you ${dayjs(props.createdAt).fromNow()}`}</Typography>
          </React.Fragment>
        )
      }
    </div>
  )
}

export default withStyles(styles)(notification);