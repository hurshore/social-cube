import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actions';
//Components
import Profile from '../../components/Profile/Profile';
import Tweets from '../Tweets/Tweets';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
  ...theme.spreadThis,
  tweetsContainer: {
    // maxWidth: 500,
    margin: 'auto',
    padding: '1rem',
    [theme.breakpoints.up('md')]: {
      marginLeft: '300px'
    }
  },
})

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      handle: this.props.match.params.handle,
      tweetIdParam: null
    }
  }

  componentDidMount() {
    const handle = this.props.match.params.handle;
    this.props.fetchProfileDetails(handle);
    const tweetId = this.props.match.params.tweetId;

    if(tweetId) {
      this.setState({ tweetIdParam: tweetId });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.handle !== this.state.handle) {
      const handle = this.props.match.params.handle;
      this.props.fetchProfileDetails(handle);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.match.params.handle !== prevState.handle) {
      console.log('Not equal');

      return {
        handle: nextProps.match.params.handle
      }
    }
    if(nextProps.match.params.tweetId !== prevState.tweetIdParam) {
      const tweetId = nextProps.match.params.tweetId;
      console.log(tweetId);
      return {
        tweetIdParam: tweetId
      }
    }
    return null;
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Profile
          uploadImage={this.uploadUserImage}
          uploadBackground={this.uploadBackgroundImage}
        />
        <div className={classes.tweetsContainer}>
          <Tweets tweetIdParam={this.state.tweetIdParam} />
        </div>
      </React.Fragment>
    )
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProfileDetails: (handle) => (dispatch(actions.fetchProfileDetails(handle)))
  }
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(User));