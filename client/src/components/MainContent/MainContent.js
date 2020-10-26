import React from 'react';

//Components
import Tweets from '../../containers/Tweets/Tweets';
import AddTweet from '../AddTweet/AddTweet';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

const styles = (theme) => ({
  ...theme.spreadThis,
  mainContent: {
    padding: '1rem',
    transition: '.5s',
    // '&.md': {
    //   marginRight: '40%'
    // },
    ['@media (min-width: 860px)']: {
      marginRight: '40%'
    },
    [theme.breakpoints.up("md")]: {
      marginLeft: '300px',
      marginRight: '32%'
    }
  },
})

const MainContent = (props) => {
  const { classes } = props;
  // const matchesMd = useMediaQuery('(min-width: 768px)');
  let attachedClasses = [classes.mainContent];
  // if(matchesMd) {
  //   attachedClasses = [classes.mainContent, 'md'];
  // }

  return (
    <div className={attachedClasses.join(' ')}>
      <AddTweet />
      <Tweets />
    </div>
  )
}

export default withStyles(styles)(MainContent);