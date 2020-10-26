import React from 'react';

//MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles';
//Icons
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) => ({
  ...theme.spreadThis,
  topnav: {
    display: 'block',
    position: 'sticky',
    top: 0,
    // backgroundColor: '#eeeef4',
    backgroundColor: theme.spreadThis.customTheme.backgroundColor,
    zIndex: 1,
    transition: '0.5s',
    height: '50px',
    [theme.breakpoints.up("md")]: {
      display: 'none'
    }
  },
  toggle: {
    top: 0,
    right: 0,
    width: '50px',
    height: '100%',
    background: '#330748',
    cursor: 'pointer',
    marginLeft: 'auto',
    float: 'right',
    display: 'inline-block',
    textAlign: 'center',
  },
  toggleIcon: {
    width: '90%',
    height: '100%',
    lineHeight: '60px',
    textAlign: 'center',
    fontSize: '24px',
    color: '#fff'
  }
})

const topnav = (props) => {
  const { classes } = props
 
  return (
    <div className={classes.topnav}>
      <div className={classes.toggle}>
        {!props.open ? 
          <MenuIcon className={classes.toggleIcon} onClick={props.toggle} /> : 
          <CloseIcon className={classes.toggleIcon} onClick={props.toggle} />
        }
      </div>
    </div>
  )
}

export default withStyles(styles)(topnav);