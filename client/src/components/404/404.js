import React from 'react';
import { Link } from 'react-router-dom';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  ...theme.spreadThis,
  error: {
    width: '100%',
    margin: 'auto',
    padding: '1rem',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.up('md')]: {
      marginLeft: '150px',
      width: 'calc(100% - 300px)'
    }
  },
  errorMessage: {
    display: 'flex',
    marginBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: '1px',
    height: '100px',
    backgroundColor: '#ccc',
    margin: '0 1rem'
  },
  redirectLink: {
    textAlign: 'center'
  }
})

const errorPage = (props) => {
  const { classes } = props;
  
  return (
    <div className={classes.error}>
      <div className={classes.errorMessage}>
        <Typography variant="h2">404</Typography>
        <div className={classes.divider}></div>
        <Typography variant="body1">This page could not be found</Typography>
      </div>
      <Typography variant="h6" className={classes.redirectLink}>
        Go <Link to="/">Home</Link>
      </Typography>
    </div>
  );
}

export default withStyles(styles)(errorPage);