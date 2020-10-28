import React from 'react';

//Routing Stuff
import { NavLink } from 'react-router-dom';
//MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
  listItem: {
    margin: '1rem 0 0 1rem',
  },
  title: {
    position: 'relative',
    display: 'block',
    padding: '0 10px',
    height: '60px',
    lineHeight: '60px',
    textAlign: 'start',
    whiteSpace: 'nowrap'
  },
  navLink: {
    width: '100%',
    display: 'flex',
    color: '#646885',
    cursor:  'pointer',
    '&.active .icon': {
      backgroundColor: theme.spreadThis.customTheme.hoverColor
    },
    '& .icon': {
      position: 'relative',
      display: 'block',
      minWidth: '60px',
      height: '60px',
      lineHeight: '60px',
      textAlign: 'center',
      borderRadius: '25%',
      cursor: 'pointer'
    },
    '&:hover .icon': {
      backgroundColor: theme.spreadThis.customTheme.hoverColor
    }
  }
})

const navigationItem = (props) => {
  const { classes } = props;

  return (
    <li className={classes.listItem}>
      {props.to ? (
        <NavLink exact to={props.to} className={classes.navLink}>
          <span className={`${props.className} icon`}>
            {props.children}
          </span>
          <span className={classes.title}>{props.textContent}</span>
        </NavLink>
      ): (
        <div className={classes.navLink} onClick={props.clicked}>
           <span className={`${props.className} icon`}>
            {props.children}
          </span>
          <span className={classes.title}>{props.textContent}</span>
        </div>
      )}
      
    </li>

  )
}

export default withStyles(styles)(navigationItem);