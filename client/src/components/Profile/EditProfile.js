import React, { useState } from 'react';
//Components
import EditDetails from './EditDetails';
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
  const { classes } = props;

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }

  return (
    <React.Fragment>
      <CustomButton btnClassName={classes.editImage} clicked={handleOpen} title="Edit profile picture">
        <EditIcon />
      </CustomButton>
      <Dialog onClose={handleClose} open={isOpen}>
        <Paper className={classes.dialogBody}>
          <Typography variant="body1" component="p" className={classes.profilePicture}>Change profile picture</Typography>
          <Typography variant="body1" component="p" className={classes.backgroundImage}>Change background image</Typography>
          <EditDetails />
        </Paper>
      </Dialog>
    </React.Fragment>
  )
}

export default withStyles(styles)(EditImage);