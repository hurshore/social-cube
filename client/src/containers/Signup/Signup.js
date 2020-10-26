import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from '../../store/actions';
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
    margin: 'auto'
  }
})


class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullName: '',
      handle: '',
      email: '',
      password: '',
      confirmPassword: ''
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

  onSignup = (event) => {
    event.preventDefault();
    this.props.onAuthSignup({
      isSignup: true,
      fullName: this.state.fullName,
      handle: this.state.handle,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      history: this.props.history
    })
  }

  render() {
    const { classes } = this.props;

    return (
        <div className={classes.formContainer}>
          <div className={classes.lockContainer}>
            <LockOutlinedIcon className={classes.lock} />
          </div>
          <Typography variant="h5" className={classes.heading}>Sign Up</Typography>
          <form className={classes.form} onSubmit={this.onSignup} noValidate autoComplete="email">
            <TextField id="fullname"
              label="Full Name"
              name="fullName"
              variant="outlined"
              fullWidth
              className={classes.textField}
              value={this.state.fullName}
              onChange={this.onInputChange}
              error={this.props.errors.fullName ? true : false}
              helperText={this.props.errors.fullName ? this.props.errors.fullName : null} />
            <TextField id="handle"
            name="handle"
            label="Handle"
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={this.state.handle}
            onChange={this.onInputChange}
            error={this.props.errors.handle ? true : false}
            helperText={this.props.errors.handle ? this.props.errors.handle : null} />
            <TextField id="email"
            label="Email Address"
            name="email"
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={this.state.email}
            onChange={this.onInputChange}
            error={this.props.errors.email ? true : false}
            helperText={this.props.errors.email ? this.props.errors.email : null} />
            <TextField id="password"
            name="password"
            type="password"
            label="Password" 
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={this.state.password}
            onChange={this.onInputChange}
            error={this.props.errors.password ? true : false}
            helperText={this.props.errors.password ? this.props.errors.password : null} />
            <TextField id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password" 
            variant="outlined"
            fullWidth
            className={classes.textField}
            value={this.state.confirmPassword}
            onChange={this.onInputChange}
            error={this.props.errors.confirmPassword ? true : false}
            helperText={this.props.errors.confirmPassword ? this.props.errors.confirmPassword : null} />
            <Button variant="contained" color="primary" type="submit" fullWidth className={classes.submitBtn} disabled={this.props.loading ? true : false}>
              Sign Up
              {this.props.loading && <CircularProgress className={classes.progress} size={35} />}
            </Button>
          </form>
          <Typography variant="body2">Already have an account? <Link to="/login">Sign In</Link></Typography>
        </div>
    )
  };
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    errors: state.auth.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuthSignup: (signupDetails) => dispatch(actions.auth(signupDetails)),
    clearAuthErrors: () => dispatch(actions.clearErrors())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Signup));