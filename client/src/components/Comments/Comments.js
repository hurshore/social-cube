import React from 'react';
import Comment from './Comment/Comment';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

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
      <Typography variant="body1" className={classes.tweetBody}>{props.tweetBody}</Typography>
      {props.comments.map((comment) => (
        <Comment key={comment.createdAt}  comment={comment} />
      ))}
    </div>
  )
}

export default withStyles(styles)(comments);