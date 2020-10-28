import React from 'react';
import { connect } from 'react-redux';

import Skeleton from 'react-loading-skeleton';
//Components
import NavigationItems from '../NavigationItems/NavigationItems';
//MUI
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Backdrop from '@material-ui/core/Backdrop';


const styles = (theme) => ({
  ...theme.spreadThis,
  sidebar: {
    position: 'fixed',
    top: 0,
    minWidth: '300px',
    maxWidth: '300px',
    height: '100%',
    backgroundColor: theme.spreadThis.customTheme.backgroundColor,
    transition: '0.5s',
    transform: 'translateX(-100%)',
    overflowX: 'hidden',
    zIndex: 1,
    [theme.breakpoints.up("md")]: {
      transform: 'translateX(0)'
    },
    '&.active': {
      transform: 'translateX(0)'
    },
    '& ul li': {
      listStyle: 'none',
      margin:' 1rem 0 0 .5rem'
    },
    '& ul li:last-child': {
      position: 'absolute',
      bottom: 0,
      width: '100%'
    }
  },
  profile: {
    width: '100%',
    height: '200px',
    position: 'relative',
    color: '#fff'
  },
  bgImage: {
    height: '100%',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  alternateBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: 'grey'
  },
  profileDetails: {
    display: 'flex',
    position: 'absolute',
    bottom: '8%',
    left: '6%',
    height: '60px'
  },
  profileImage: {
    width: '60px',
    height: '60px',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '25%'
    }
  },
  profileCredentials: {
    marginLeft: '1rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& .name': {
      marginBottom: '.3rem'
    }
  },
  backdrop: {
    zIndex: 1,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
})

const sidenav = (props) => {
  const { classes, credentials: { imageUrl, backgroundUrl, fullName, handle }} = props;

  let attachedClasses = [classes.sidebar]
  if(props.open) {
    attachedClasses = [classes.sidebar, 'active']
  }

  return (
    <React.Fragment>
      <Backdrop open={props.open} onClick={props.handleClose} className={classes.backdrop}>
      </Backdrop>
      <Paper>
        <div className={attachedClasses.join(' ')} onClick={props.handleClose}>
          <div className={classes.profile}>
            <div className={classes.bgImage}>
              {
                backgroundUrl ? <img src={ backgroundUrl } alt="background" /> : <div className={classes.alternateBackground}></div>
              }
            </div>
            <div className={classes.profileDetails}>
              <div className={classes.profileImage}>
                {
                  imageUrl ? <img src={imageUrl} alt="profile" /> : <Skeleton circle={true} width={60} height={60} />
                }
              </div>
              <div className={classes.profileCredentials}>
                <div className="name">
                  <Typography variant="h5">
                    {fullName || <Skeleton width={120} height={20} />}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2">
                    {handle || <Skeleton width={50} height={20} />}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <NavigationItems />
        </div>
      </Paper>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    credentials: state.user.credentials
  }
}

export default connect(mapStateToProps)(withStyles(styles)(sidenav));