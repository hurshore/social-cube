import React from 'react';
//MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (withStyles) => ({
  btn: {
    fontSize: '1rem'
  }
});

const DeleteDialog = (props) => {
  const { classes } = props;
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="delete-tweet"
      aria-describedby="delete-tweet-dialog"
    >
      <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete this tweet?"}</DialogTitle>
      <DialogActions>
        <Button onClick={props.onClose} color="primary" className={classes.btn}>
          Cancel
        </Button>
        <Button onClick={props.delete} color="secondary" autoFocus className={classes.btn}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    )
};


export default withStyles(styles)(DeleteDialog);