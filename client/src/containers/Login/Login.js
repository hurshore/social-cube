import React, { Component } from 'react';

import * as actions from '../../store/actions';
import { connect } from 'react-redux';
//Routing stuff
import { Link } from 'react-router-dom';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
//Icons
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const styles = (theme) => ({
  ...theme.spreadThis,
  progress: {
    position: 'absolute',
    margin: 'auto',
  },
  error: {
    color: '#f44336',
    fontSize: '.8rem'
  },
  form: {
    marginTop: 0
  },
  heading: {
    marginBottom: '1rem',
    textAlign: 'center'
  }
})


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errors: null
    }
  }

  componentDidMount() {
    this.props.clearAuthErrors();
  }

  onInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onLogin = (event) => {
    event.preventDefault();
    this.props.onAuthLogin({
      email: this.state.email,
      password: this.state.password,
      history: this.props.history,
      redirectPath: this.props.authRedirectPath
    });
  }

  render() {
    const { classes } = this.props;

    return (
        <div className={classes.formContainer}>
          <div className={classes.lockContainer}>
            <LockOutlinedIcon className={classes.lock} />
          </div>
          <Typography variant="h5" className={classes.heading}>Sign In</Typography>
          { this.props.errors.general ? <Typography component="p" className={classes.error}>{this.props.errors.general}</Typography> : null }
          <form className={classes.form} onSubmit={this.onLogin} noValidate autoComplete="email">
            <TextField
            label="Email Address*"
            variant="outlined"
            name="email"
            type="email"
            fullWidth
            className={classes.textField}
            value={this.state.email}
            onChange={this.onInputChange}
            error={this.props.errors.email ? true : false}
            helperText={this.props.errors.email ? this.props.errors.email : null} />
            <TextField
            label="Password*" 
            variant="outlined"
            name="password"
            type="password"
            fullWidth
            className={classes.textField}
            value={this.state.password}
            onChange={this.onInputChange}
            error={this.props.errors.password ? true : false}
            helperText={this.props.errors.password ? this.props.errors.password : null} />
            <Button variant="contained" color="primary" type="submit" fullWidth className={classes.submitBtn} disabled={this.props.loading}>
              Sign in
              {this.props.loading && <CircularProgress className={classes.progress} size={35} />}
            </Button>
          </form>
          <Typography variant="body2">Don't have an account yet? <Link to="/signup">Sign Up</Link></Typography>
        </div>
    )
  };
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    errors: state.auth.errors,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthLogin: (loginDetails) => dispatch(actions.auth(loginDetails)),
    clearAuthErrors: () => dispatch(actions.clearErrors())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login));