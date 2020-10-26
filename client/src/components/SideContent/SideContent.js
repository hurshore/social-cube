import React from 'react';

//Components
import PopularPosts from '../../containers/PopularTweets/PopularTweets';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const styles = (theme) => ({
  ...theme.spreadThis,
  sideContent: {
    width: '40%',
    position: 'fixed',
    right: 0,
    top: 0,
    padding: '1rem 1rem 0 0',
    marginTop: '50px',
    // [theme.breakpoints.up("sm")]: {
    //   display: 'block'
    // },
    [theme.breakpoints.up("md")]: {
      marginTop: 0,
      width: '32%'
    }
  }
})

const SideContent = (props) => {
  const { classes } = props;
  const matches = useMediaQuery('(min-width: 860px)');

  return (
    matches ? (
      <div className={classes.sideContent}>
        <PopularPosts />
      </div>
    ) : null
  )
}

export default withStyles(styles)(SideContent);