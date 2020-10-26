import React from 'react';
//MUI stuff
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
//Icons
import CloseIcon from '@material-ui/icons/Close';

const customSnackbar = (props) => (
  <Snackbar
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    open={props.open}
    autoHideDuration={3000}
    onClose={props.clicked}
    message={props.message}
    action={
      <React.Fragment>
        <IconButton size="small" aria-label="close" color="inherit" onClick={props.clicked}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
  />
)

export default customSnackbar