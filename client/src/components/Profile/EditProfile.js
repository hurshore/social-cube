import React, { useState } from 'react';
import * as actions from '../../store/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//Components
import EditDetails from './EditDetails';
import EditPicture from './EditPicture';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
//Icons
import EditIcon from '@material-ui/icons/Edit';
import CustomButton from '../UI/CustomButton/CustomButton';

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
  const { classes } = props;

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <React.Fragment>
      {/* <CustomSnackbar open={snackbarOpen} clicked={snackbarCloseHandler} message="Uploading image..." /> */}
      <CustomButton btnClassName={classes.editImage} clicked={handleOpen} title="Edit profile">
        <EditIcon />
      </CustomButton>
      <Dialog onClose={handleClose} open={isOpen}>
        <Paper className={classes.dialogBody}>
          {/* <Typography variant="body1" component="p" className={classes.profilePicture} onClick={profileImageHandler}>Change profile picture</Typography>
          <Typography variant="body1" component="p" className={classes.backgroundImage} onClick={backgroundImageHandler}>Change background image</Typography> */}
          <EditDetails />
          <EditPicture />
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