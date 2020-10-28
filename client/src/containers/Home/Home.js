import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import MainContent from '../../components/MainContent/MainContent';
import SideContent from '../../components/SideContent/SideContent';
import * as actions from '../../store/actions';

class Home extends Component {
  componentDidMount() {
    this.props.onFetchTweets();
  }

  render() {
    let homeMarkup = (
      <React.Fragment>
        <MainContent tweets={this.props.tweets} />
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
    authenticated: state.auth.authenticated,
    tweets: state.data.tweets
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchTweets: () => dispatch(actions.fetchTweets())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);