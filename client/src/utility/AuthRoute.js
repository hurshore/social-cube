import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom'

const authRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) => 
      authenticated ? <Redirect to="/" /> : <Component {...props} />
    }
  />
)

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps)(authRoute)