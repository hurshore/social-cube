import { Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
//Components
import ListItemLink from '../UI/ListItemLink/ListItemLink';
//MUI stuff
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
  followingWrapper: {
    width: 400,
    maxWidth: '100%'
  },
  empty: {
    padding: '.5rem'
  }
})

const Following = (props) => {
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
      {
        props.followingCount > -1 ? (
          <Button onClick={openHandler}>{`${props.followingCount} following`}</Button>
        ) : <Skeleton width={100} height={20} />
      }
      <Dialog open={isOpen} onClose={closeHandler}>
        <Paper className={classes.followingWrapper}>
          <List>
            {props.following && props.following.length !== 0 ?
              props.following.map((following) => (
                <ListItemLink key={following} text={`@${following}`} to={`/users/${following}`} clicked={closeHandler}></ListItemLink>
              )) : <Typography variant="body1" component="p" className={classes.empty}>This user is following no one</Typography>
            }
          </List>
        </Paper>
      </Dialog>
    </React.Fragment>
  )
}

export default withStyles(styles)(Following);