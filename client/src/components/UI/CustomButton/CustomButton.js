import React from 'react';

//MUI stuff
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const customButton = (props) => (
  <Tooltip title={props.title} className={props.tipClassName} placement={props.placement}>
    <IconButton aria-label={props.label} className={props.btnClassName} onClick={props.clicked}>
      {props.children}
    </IconButton>
  </Tooltip>
);

export default customButton;