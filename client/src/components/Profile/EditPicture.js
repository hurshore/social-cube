import React, { useState, useRef } from 'react';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';
//Utility
import { compressImage } from '../../shared/utility';
//Components
import CustomSnackbar from '../UI/CustomSnackbar/CustomSnackbar';
//MUI stuff
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
  anchorEl: {
    cursor: 'pointer'
  }
})

const EditPicture = (props) => {
  const { classes } = props;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const imageInput = useRef(null);
  const backgroundInput = useRef(null);

  const snackbarOpenHandler = () => {
    setSnackbarOpen(true);
  }

  const snackbarCloseHandler = () => {
    setSnackbarOpen(false);
  }

  const profileImageHandler = () => {
    imageInput.current.click();
    // setIsOpen(false);
  }

  const backgroundImageHandler = () => {
    backgroundInput.current.click();
    // setIsOpen(false);
  }

  const handleProfileImageChange = () => {
    if(imageInput.current.files.length > 0) {
      snackbarOpenHandler();
      // const handle = props.match.params.handle;
      const handle = props.handle
      compressImage(imageInput.current.files[0])
      .then((compressedImage) => {
        props.uploadImage({
          image: compressedImage,
          FBIdToken: props.FBIdToken,
          handle
        });
      })
      .catch((err) => {
        console.log(err);
      })
    } 
  }

  const handleBackgroundImageChange = () => {
    if(backgroundInput.current.files.length > 0) {
      snackbarOpenHandler();
      // const handle = props.match.params.handle;
      const handle = props.handle;
      compressImage(backgroundInput.current.files[0])
      .then((compressedImage) => {
        props.uploadBackground({
          image: compressedImage,
          FBIdToken: props.FBIdToken,
          handle
        });
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }

  return (
    <div>
      <Typography variant="body1" component="p" onClick={profileImageHandler} className={classes.anchorEl}>Change profile picture</Typography>
      <Typography variant="body1" component="p" onClick={backgroundImageHandler} className={classes.anchorEl}>Change background image</Typography>
      <CustomSnackbar open={snackbarOpen} clicked={snackbarCloseHandler} message="Uploading image..." />
      <input
        type="file"
        ref={imageInput}
        accept="image/*"
        hidden="hidden"
        onChange={handleProfileImageChange}
      />
      <input
        type="file"
        ref={backgroundInput}
        accept="image/*"
        hidden="hidden"
        onChange={handleBackgroundImageChange}
      />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    handle: state.user.credentials.handle,
    FBIdToken: state.auth.FBIdToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadImage: (payload) => dispatch(actions.uploadUserImage(payload)),
    uploadBackground: (payload) => dispatch(actions.uploadBackgroundImage(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditPicture));