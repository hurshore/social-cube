import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { compressImage } from '../../shared/utility';
//Components
import Followers from '../Followers/Followers';
import Following from '../Following/Following';
import CustomButton from '../UI/CustomButton/CustomButton';
import EditProfile from './EditProfile';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
//Icons
import EditIcon from '@material-ui/icons/Edit';

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
  }
})

const Profile = (props) => {
  const { classes, profile: { backgroundUrl, imageUrl, fullName, handle } } = props;
  const following = props.authUserFollowing.find((user) => {
    return user === handle;
  })
  const imageInput = useRef(null);
  const backgroundInput = useRef(null);

  const handleImageChange = () => {
    compressImage(imageInput.current.files[0])
      .then((compressedImage) => {
        props.uploadImage(compressedImage);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const handleEditPicture = () => {
    imageInput.current.click();
  }

  const handleBackgroundChage = () => {

  }

  const handleEditBackground = () => {

  }

  return (
    <div className={classes.user}>
      <div className={classes.backgroundImg}>
        <img src={backgroundUrl} alt="background" />
      </div>
      <div className={classes.userImageWrapper}>
        <Avatar alt={fullName} src={imageUrl} className={classes.userImage} />
        {/* <CustomButton btnClassName={classes.editImage} clicked={handleEditPicture} title="Edit profile picture">
          <EditIcon />
        </CustomButton> */}
        <EditProfile />
        <input
          type="file"
          ref={imageInput}
          accept="image/*"
          hidden="hidden"
          onChange={handleImageChange}
        />
      </div>
      <div className={classes.userDetails}>
        <Typography component="h1">
          {fullName}
          <Typography variant="body2">{`@${handle}`}</Typography>
        </Typography>
        <Followers followerCount={props.profile.followerCount} followers={props.followers} />
        <Following followingCount={props.profile.followingCount} following={props.following} />
        {
          handle === props.userHandle ? null :
            following ? (
              <Button color="secondary" variant="contained" onClick={props.unfollow}>Unfollow</Button>
            ) : (
              <Button color="primary"  variant="contained" onClick={props.follow}>Follow</Button>
            )
        }
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    userHandle: state.user.credentials.handle,
    authUserFollowing: state.user.following
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Profile));