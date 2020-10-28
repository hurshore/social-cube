import React from 'react';
import Skeleton from 'react-loading-skeleton';
import Comment from './Comment/Comment';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = (theme) => ({
  ...theme.spreadThis,
  comments: {
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },
  tweetBody: {
    padding: '1rem',
    fontSize: '1rem'
  }
})

const comments = (props) => {
  const { classes } = props;

  return (
    <div className={classes.comments}>
      <div>
        <Typography variant="body1" className={classes.tweetBody}>
          {props.tweetBody || <Skeleton width={200} />}
        </Typography>
        <Divider />
      </div>
      {props.comments.map((comment) => (
        <Comment key={comment.createdAt}  comment={comment} />
      ))}
    </div>
  )
}

export default withStyles(styles)(comments);