import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
//Components
import ListItemLink from '../UI/ListItemLink/ListItemLink';
//MUI stuff
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
  followersWrapper: {
    width: 400,
    maxWidth: '100%',
  },
  empty: {
    padding: '.5rem'
  },
  followButton: {
    marginRight: '.5rem',
    display: 'inline-block'
  }
})

const Followers = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { classes } = props;

  const openHandler = () => {
    setIsOpen(true);
  }

  const closeHandler = () => {
    setIsOpen(false);
  }
  
  return (
    <React.Fragment>
      <div className={classes.followButton}>
        {
          props.followerCount > -1 ? (
            <Button onClick={openHandler}>
              {props.followerCount !== 1 ? `${props.followerCount} followers` : `${props.followerCount} follower`}
            </Button>
          ) : (
            <Skeleton width={100} height={20} />
          )
        }
      </div>
      <Dialog open={isOpen} onClose={closeHandler}>
        <Paper className={classes.followersWrapper}>
          <List>
            {props.followers && props.followers.length !== 0 ?
              props.followers.map((follower) => (
                <ListItemLink key={follower} text={`@${follower}`} to={`/users/${follower}`} clicked={closeHandler}></ListItemLink>
              )) : <Typography variant="body1" component="p" className={classes.empty}>This user has no followers</Typography>
            }
          </List>
        </Paper>
      </Dialog>
    </React.Fragment>
  )
}

export default withStyles(styles)(Followers);