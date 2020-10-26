import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainContent from '../../components/MainContent/MainContent';
import SideContent from '../../components/SideContent/SideContent';

class Home extends Component {
  render() {
    let homeMarkup = (
      <React.Fragment>
        <MainContent />
        <SideContent />
      </React.Fragment>
    )

    if(!this.props.authenticated) {
      homeMarkup = <Redirect to="/login" />
    }

    return (
      <React.Fragment>
        { homeMarkup }
      </React.Fragment>
    )
  };
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated
  }
}

export default connect(mapStateToProps)(Home);