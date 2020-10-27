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
      profile: {},
      followers: [],
      following: [],
      handle: this.props.match.params.handle,
      tweetIdParam: null
    }
  }

  componentDidMount() {
    // this.fetchUserDetails();
    const handle = this.props.match.params.handle;
    this.props.fetchProfileDetails(handle);
    const tweetId = this.props.match.params.tweetId;

    if(tweetId) {
      this.setState({ tweetIdParam: tweetId });
    }
  }

  fetchUserDetails = () => {
    const handle = this.props.match.params.handle;
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${handle}`)
      .then(async (res) => {
        if(res.ok) {
          const data = await res.json();
          this.setState({
            profile: data.user, 
            followers: data.followers,
            following: data.following
          });
          this.props.setTweets(data.tweets);
          console.log(data);
        } else {
          const err = await res.clone().json();
          throw err;
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.handle !== this.state.handle) {
      // this.fetchUserDetails();
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

  followUser = (handle) => {
    const profile = {...this.state.profile};
    const followers = [...this.state.followers];
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${handle}/follow`, {
      headers: {
        'Authorization': this.props.FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        profile.followerCount += 1;
        followers.push(this.props.userHandle);
        this.setState({
          profile,
          followers
        })
        this.props.followUser(handle);
      } else {
        const err = await res.clone().json();
        throw err;
      }
      
    })
    .catch((err) => {
      console.log(err);
    })
  }

  unfollowUser = (handle) => {
    const profile = {...this.state.profile};
    const followers = [...this.state.followers];
    fetch(`https://europe-west1-socialio-a0744.cloudfunctions.net/api/user/${handle}/unfollow`, {
      headers: {
        'Authorization': this.props.FBIdToken
      }
    })
    .then(async (res) => {
      if(res.ok) {
        const data = await res.json();
        console.log(data);
        profile.followerCount -= 1;
        const index = followers.indexOf(this.props.userHandle);
        followers.splice(index, 1);
        this.setState({
          profile,
          followers
        })
        this.props.unfollowUser(handle);
      } else {
        const err = await res.clone().json();
        throw err;
      }
      
    })
    .catch((err) => {
      console.log(err);
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Profile
          follow={() => this.followUser(this.state.profile.handle)}
          unfollow={() => this.unfollowUser(this.state.profile.handle)}
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

const mapStateToProps = (state) => {
  return {
    FBIdToken: state.auth.FBIdToken,
    userHandle: state.user.credentials.handle,
    followers: state.profile.followers,
    following: state.profile.following
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setTweets: (payload) => dispatch(actions.fetchTweetsSuccess(payload)),
    followUser: (handle) => (dispatch(actions.followUser(handle))),
    unfollowUser: (handle) => (dispatch(actions.unfollowUser(handle))),
    getUserData: (FBIdToken) => (dispatch(actions.getUserData(FBIdToken))),
    fetchProfileDetails: (handle) => (dispatch(actions.fetchProfileDetails(handle)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(User));