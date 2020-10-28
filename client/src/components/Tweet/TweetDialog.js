import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import * as actions from '../../store/actions';
//Components
import Comments from '../Comments/Comments';
import CustomButton from '../UI/CustomButton/CustomButton';
//MUI
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
//Icons
import UnfoldMore from '@material-ui/icons/UnfoldMore';

const styles = (theme) => ({
  ...theme.spreadThis,
  expand: {
    marginLeft: 'auto'
  },
  tweetImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  dialogContent: {
    height: '80vh',
    padding: '0 !important'
  },
  tweetContainer: {
    height: '100%'
  },
  tweetImageContainer: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: '100%'
    }
  },
  tweetContent: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: '100%'
    }
  },
  tweetContentWrapper: {
    display: 'flex',
    flexFlow: 'column',
    maxHeight: '100%'
  },
  formContainer: {
    position: 'sticky',
    top: 0,
    zIndex: 1
  },
  form: {
    padding: '1rem'
  },
  submitBtn: {
    marginTop: '.5rem'
  },
  imageSkeleton: {
    height: '300px',
    [theme.breakpoints.up('sm')]: {
      height: '100%'
    },
    '& div': {
      height: '100%'
    }
  }
})

const TweetDialog = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [oldPath, setOldPath] = useState('');
  const [newPath, setNewPath] = useState('');

  const { classes, fetchTweet, tweetId, tweet, userHandle, openDialog } = props;

  const openHandler = useCallback(() => {
    let oldPath = window.location.pathname;
    let newPath = `/users/${userHandle}/tweet/${tweetId}`;

    if(oldPath === newPath) {
      oldPath = `/users/${userHandle}`;
    }

    window.history.pushState(null, null, newPath);
    setOldPath(oldPath);
    setNewPath(newPath);
    setIsOpen(true);
    fetchTweet(tweetId);
  }, [fetchTweet, tweetId, userHandle])

  useEffect(() => {
    if(openDialog) {
      openHandler();
    }
  }, [openDialog, openHandler])

  const closeHandler = () => {
    setIsOpen(false);
    window.history.pushState(null, null, oldPath);
    props.clearTweet();
  }

  const inputChangeHandler = (event) => {
    setComment(event.target.value);
  }

  const submitHandler = (event, tweetId) => {
    event.preventDefault();
    if(!props.authenticated) {
      props.setAuthRedirectPath(`/users/${props.tweet.userHandle}/tweet/${tweetId}`);
      props.history.push('/login');
      return;
    }
    const body = { body: comment }
    setLoading(true)
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/tweet/${tweetId}/comment`, {
      method: 'POST',
      headers: {
        'Authorization': props.FBIdToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    .then(async (res) => {
      if(res.ok) {
        return res.json()
          .then((data => {
            setComment('');
            setLoading(false);
            props.postComment(data);
          }));
      } else {
        const err = await res.clone().json();
        throw err;
      }
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    })
  }
  
  return (
    <React.Fragment>
      <CustomButton btnClassName={classes.expand} clicked={openHandler} title="Expand tweet" placement="bottom">
        <UnfoldMore />
      </CustomButton>
      <Dialog open={isOpen} onClose={closeHandler} className={classes.tweetContainer} fullWidth maxWidth="md">
        <DialogContent className={classes.dialogContent}>
          <Grid container className={classes.tweetContainer}>
            <Grid item sm={7} className={classes.tweetImageContainer}>
              {tweet.tweetImageUrl ?
                <img src={tweet.tweetImageUrl} alt="post" className={classes.tweetImage} /> : (
                  <div className={classes.imageSkeleton}>
                    <SkeletonTheme color="grey" height={'100%'}>
                      <Skeleton height={'100%'} />
                    </SkeletonTheme>
                  </div>
                )
              }
            </Grid>
            <Grid item sm={5} className={classes.tweetContent}>
              <div className={classes.tweetContentWrapper}>
                <Paper className={classes.formContainer}>
                  <form onSubmit={(event) => submitHandler(event, tweet.tweetId)} className={classes.form}>
                    <TextField
                      label="Say something"
                      multiline
                      fullWidth
                      rowsMax={3}
                      value={comment}
                      onChange={inputChangeHandler}
                    />
                    <Button 
                      type="submit" 
                      color="primary" 
                      variant="contained" 
                      className={classes.submitBtn}
                      disabled={comment.trim().length === 0 || loading}>
                        POST
                    </Button>
                  </form>
                </Paper>
                {tweet.comments ? 
                  <Comments comments={tweet.comments} tweetBody={props.tweetBody} /> : null
                }
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    tweet: state.data.tweet,
    FBIdToken: state.auth.FBIdToken,
    authenticated: state.auth.authenticated
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTweet: (tweetId) => dispatch(actions.fetchTweet(tweetId)),
    clearTweet: () => dispatch(actions.clearTweet()),
    postComment: (data) => dispatch(actions.postComment(data)),
    setAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(TweetDialog)));