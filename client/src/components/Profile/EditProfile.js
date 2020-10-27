import React, { useState, useRef } from 'react';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//Utility
import { compressImage } from '../../shared/utility';
//Components
import EditDetails from './EditDetails';
import CustomSnackbar from '../UI/CustomSnackbar/CustomSnackbar';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
//Icons
import EditIcon from '@material-ui/icons/Edit';
import CustomButton from '../UI/CustomButton/CustomButton';
import { Typography } from '@material-ui/core';

const styles = (theme) => ({
  ...theme.spreadThis,
  editImage: {
    position: 'absolute',
    bottom: -11,
    right: -18,
    cursor: 'pointer'
  },
  dialogBody: {
    padding: '.7rem',
    '& p': {
      margin: '.5rem 0'
    }
  }
})

const EditImage  = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const imageInput = useRef(null);
  const backgroundInput = useRef(null);
  const { classes } = props;

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  const snackbarOpenHandler = () => {
    setSnackbarOpen(true);
  }

  const snackbarCloseHandler = () => {
    setSnackbarOpen(false);
  }

  const profileImageHandler = () => {
    imageInput.current.click();
    setIsOpen(false);
  }

  const backgroundImageHandler = () => {
    backgroundInput.current.click();
    setIsOpen(false);
  }

  const handleProfileImageChange = () => {
    if(imageInput.current.files.length > 0) {
      snackbarOpenHandler();
      const handle = props.match.params.handle;
      compressImage(imageInput.current.files[0])
      .then((compressedImage) => {
        console.log('Uploading image...')
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
      const handle = props.match.params.handle;
      compressImage(backgroundInput.current.files[0])
      .then((compressedImage) => {
        console.log('Uploading image...')
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
    <React.Fragment>
      {/* <CustomSnackbar open={snackbarOpen} clicked={snackbarCloseHandler} message="Uploading image..." /> */}
      <CustomButton btnClassName={classes.editImage} clicked={handleOpen} title="Edit profile picture">
        <EditIcon />
      </CustomButton>
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
      <Dialog onClose={handleClose} open={isOpen}>
        <Paper className={classes.dialogBody}>
          <Typography variant="body1" component="p" className={classes.profilePicture} onClick={profileImageHandler}>Change profile picture</Typography>
          <Typography variant="body1" component="p" className={classes.backgroundImage} onClick={backgroundImageHandler}>Change background image</Typography>
          <EditDetails />
        </Paper>
      </Dialog>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    FBIdToken: state.auth.FBIdToken
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    uploadImage: (payload) => dispatch(actions.uploadUserImage(payload)),
    uploadBackground: (payload) => dispatch(actions.uploadBackgroundImage(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(withRouter(EditImage)));