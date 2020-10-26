import React from 'react';
import { connect } from 'react-redux';

//Components
import NavigationItems from '../NavigationItems/NavigationItems';
//Images
import backgroundImg from '../../../assets/images/background-img.jpg';
import profileImg from '../../../assets/images/profile-img.jpg';
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
              <img src={ backgroundUrl } alt="background" />
            </div>
            <div className={classes.profileDetails}>
              <div className={classes.profileImage}>
                <img src={imageUrl} alt="profile" />
              </div>
              <div className={classes.profileCredentials}>
                <div className="name">
                  <Typography variant="h5">{fullName}</Typography>
                </div>
                <div>
                  <Typography variant="body2">{handle}</Typography>
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