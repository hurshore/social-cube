import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';

//Components
import CustomSnackbar from '../UI/CustomSnackbar/CustomSnackbar';
//MUI stuff
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  ...theme.spreadThis,
  dialogBody: {
    padding: '1rem',
    textAlign: 'center'
  },
  anchorEl: {
    cursor: 'pointer'
  },
  title: {
    padding: 0
  },
  formWrapper: {
    padding: 0
  },
  textField: {
    margin: '0 0 .8rem 0'
  }
})

const EditDetails = (props) => {
  const [state, setState] = useState({
    isOpen: false,
    bio: '',
    location: '',
    website: ''
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { classes } = props;

  const openHandler = () => {
    setState({
      ...state,
      isOpen: true,
      bio: props.credentials.bio ? props.credentials.bio : '',
      location: props.credentials.location ? props.credentials.location : '',
      website: props.credentials.website ? props.credentials.website : ''
    })
  }

  const closeHandler = () => {
    setState({
      ...state,
      isOpen: false
    })
  }

  const snackbarOpenHandler = () => {
    setSnackbarOpen(true);
  }

  const snackbarCloseHandler = () => {
    setSnackbarOpen(false);
  }

  const inputChangeHandler = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const submitHandler = (event) => {
    event.preventDefault();
    snackbarOpenHandler();
    const data = {
      bio: state.bio,
      location: state.location,
      website: state.website,
      FBIdToken: props.FBIdToken
    }
    props.editProfileDetails(data);
    setState({
      ...state,
      isOpen: false
    })
  }

  return (
    <React.Fragment>
      <Typography variant="body1" component="p" onClick={openHandler} className={classes.anchorEl}>Edit profile details</Typography>
      <Dialog open={state.isOpen} onClose={closeHandler}>
        <Paper className={classes.dialogBody}>
          <DialogTitle className={classes.title}>Edit your details</DialogTitle>
          <DialogContent className={classes.formWrapper}>
            <form onSubmit={submitHandler}>
              <TextField
                name="bio"
                multiline
                type="text"
                label="Bio"
                rowsMax={3}
                fullWidth
                onChange={inputChangeHandler}
                value={state.bio}
                className={classes.textField}
                inputProps={{ maxLength: 100 }}
              />
              <TextField
                name="location"
                multiline
                type="text"
                label="Location"
                rowsMax={2}
                maxLength="2"
                fullWidth
                onChange={inputChangeHandler}
                value={state.location}
                className={classes.textField}
                inputProps={{ maxLength: 30 }}
              />
              <TextField
                name="website"
                type="text"
                label="Website"
                rowsMax={2}
                maxLength="2"
                fullWidth
                onChange={inputChangeHandler}
                value={state.website}
                className={classes.textField}
                inputProps={{ maxLength: 30 }}
              />
              <Button type="submit" color="primary" variant="contained">Save</Button>
            </form>
          </DialogContent>
        </Paper>
      </Dialog>
      <CustomSnackbar open={snackbarOpen} clicked={snackbarCloseHandler} message="Uploading details..." />
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    FBIdToken: state.auth.FBIdToken,
    credentials: state.profile.credentials
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    editProfileDetails: (payload) => dispatch(actions.editProfileDetails(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(EditDetails));