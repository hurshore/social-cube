import React, { useState } from 'react';

//MUI stuff
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

const styles = (theme) => ({
  ...theme.spreadThis,
  dialogBody: {
    padding: '1rem',
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
  const { classes } = props;

  const openHandler = () => {
    setState({
      ...state,
      isOpen: true
    })
  }

  const closeHandler = () => {
    setState({
      ...state,
      isOpen: false
    })
  }

  const inputChangeHandler = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const submitHandler = (event) => {
    event.preventDefault();
    //Submit form
  }

  return (
    <React.Fragment>
      <Typography variant="body1" component="p" onClick={openHandler}>Edit profile details</Typography>
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
                inputProps={{ maxLength: 20 }}
              />
            </form>
          </DialogContent>
        </Paper>
      </Dialog>
    </React.Fragment>
  )
}

export default withStyles(styles)(EditDetails);