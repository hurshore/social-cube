import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import * as actions from '../../store/actions';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ThemeContext } from '../../context/themeContext';
//Components
import Followers from '../Followers/Followers';
import Following from '../Following/Following';
import EditProfile from './EditProfile';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MUILink from '@material-ui/core/Link';
//Icons
import LocationOnIcon from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';

const styles = (theme) => ({
  ...theme.spreadThis,
  user: {
    transition: '.5s',
    [theme.breakpoints.up("md")]: {
      marginLeft: '300px'
    }
  },
  backgroundImg: {
    height: 200,
    [theme.breakpoints.up("sm")]: {
      height: 300
    },
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  alternateBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: 'grey'
  },
  userImageWrapper: {
    margin: 'auto',
    transform: 'translateY(-50px)',
    height: '100px',
    width: '100px'
  },
  userImage: {
    width: '100%',
    height: '100%'
  },
  userDetails: {
    padding: '1rem',
    marginTop: '-50px',
    textAlign: 'center'
  },
  editImage: {
    position: 'absolute',
    bottom: -11,
    right: -18,
    cursor: 'pointer'
  },
  name: {
    display: 'flex',
    
  },
  fullName: {
    fontSize: '1.2rem'
  },
  handle: {
    color: 'rgb(101, 119, 134)',
    fontSize: '.9rem'
  },
  bio: {
    fontSize: '.9rem',
    margin: '.7rem 0'
  },
  location: {
    color: 'rgb(101, 119, 134)',
    marginRight: '.7rem',
    display: 'flex',
    '& svg': {
      marginRight: '.4rem',
      fontSize: '1.2rem'
    }
  },
  otherDetails: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
    [theme.breakpoints.up('sm')]: {
      flexFlow: 'row',
      justifyContent: 'center'
    }
  },
  website: {
    display: 'flex',
    '& svg': {
      marginRight: '.4rem'
    }
  }
})

const Profile = (props) => {
  const { classes, profile: { backgroundUrl, imageUrl, fullName, handle }, authenticated } = props;
  const following = props.authUserFollowing.find((user) => {
    return user === handle;
  })
  const themeContext = useContext(ThemeContext);
  let skeletonColor = '#edebed';
  let skeletonHightlightColor = '#fff';
  if(themeContext.theme === 'light') {
    skeletonColor = '#202020';
    skeletonHightlightColor = '#444';
  }

  const followUser = () => {
    if(!authenticated) {
      props.history.push('/login');
    }
    const data = {
      followHandle: handle,
      followingHandle: props.userHandle,
      FBIdToken: props.FBIdToken
    }
    props.followUser(data);
  }

  const unfollowUser = () => {
    const data = {
      unfollowHandle: handle,
      unfollowingHandle: props.userHandle,
      FBIdToken: props.FBIdToken
    }
    props.unfollowUser(data);
  }

  return (
    <div className={classes.user}>
      <div className={classes.backgroundImg}>
        {
          backgroundUrl ? 
          <img src={backgroundUrl} alt="background" /> : 
          <div className={classes.alternateBackground}>
          </div>
        }
      </div>
      <div className={classes.userImageWrapper}>
        <Avatar alt={fullName} src={imageUrl} className={classes.userImage} />
        {
          handle && handle === props.userHandle ? <EditProfile /> : null
        }
      </div>
      <div className={classes.userDetails}>
        <Typography component="h1" className={classes.fullName}>
            {fullName || (
              <SkeletonTheme color={skeletonColor} highlightColor={skeletonHightlightColor}>
                <Skeleton width={120} />
              </SkeletonTheme>
            )}
        </Typography>
        <SkeletonTheme color={'rgb(101, 119, 134)'}>
          {
            handle ? (
            <Typography variant="body1" className={classes.handle}>
              {`@${handle}`}
            </Typography>
            ) : <Skeleton width={50} />
          }
        </SkeletonTheme>
        {props.profile.bio ? 
          <Typography variant="body2" component="p" className={classes.bio}>{props.profile.bio}</Typography> : null
        }
        <div className={classes.otherDetails}>
          {props.profile.location ? 
            (
              <Typography variant="body2" component="p" className={classes.location}>
                <LocationOnIcon className={classes.locationIcon} />
                {props.profile.location}
              </Typography> 
            ) : null
          }
          {props.profile.website ? 
            <MUILink href={props.profile.website} className={classes.website} color="primary">
              <LinkIcon />
              {props.profile.website}
            </MUILink> : null  
          }
        </div>
        <div>
          <Followers followerCount={props.profile.followerCount} followers={props.followers} />
          <Following followingCount={props.profile.followingCount} following={props.following} />
        </div>
        {
          Object.keys(props.profile).length > 0 ? (
            handle === props.userHandle ? null :
            following ? (
              <Button color="secondary" variant="contained" onClick={unfollowUser}>Unfollow</Button>
            ) : (
              <Button color="primary"  variant="contained" onClick={followUser}>Follow</Button>
            )
          ) : null
        }
        {
          props.errors.user ? (
            <div>
              <h3>
                User not found. Go <Link to="/">Home</Link>
              </h3>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userHandle: state.user.credentials.handle,
    authUserFollowing: state.user.following,
    profile: state.profile.credentials,
    followers: state.profile.followers,
    following: state.profile.following,
    FBIdToken: state.auth.FBIdToken,
    authenticated: state.auth.authenticated,
    errors: state.profile.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    followUser: (payload) => (dispatch(actions.followUser(payload))),
    unfollowUser: (payload) => (dispatch(actions.unfollowUser(payload))),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(Profile)));