import React, { useContext, useEffect, useState } from 'react';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ThemeContext } from './context/themeContext';
import axios from 'axios';
import * as actions from './store/actions';

//Components
import Sidenav from './components/Navigation/Sidenav/Sidenav';
import Topnav from './components/Navigation/Topnav/Topnav';
//HOC
import AuthRoute from './utility/AuthRoute';
//Pages
import Home from './containers/Home/Home';
import Login from './containers/Login/Login';
import Signup from './containers/Signup/Signup';
import User from './containers/User/User';
import UnknownRoute from './components/404/404';
//Components
import Logout from './components/Logout/Logout';
//MUI
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiStrictModeTheme';
import CSSBaseline from '@material-ui/core/CssBaseline';

axios.defaults.baseURL = 'https://europe-west1-socialio-a0744.cloudfunctions.net/api';

console.log(process.env.REACT_APP_VAPID_PUBLIC_KEY);
console.log('Something');

function App(props) {
  const themeContext = useContext(ThemeContext);

  const theme = createMuiTheme({
    palette: {
      type: themeContext.theme,
      primary: {
        light: '#33c9dc',
        main: '#1976d2',
        dark: '#008394',
        contrastText: '#fff'
      },
      secondary: {
        light: '#ff6333',
        main: '#ff3d00',
        dark: '#b22a00',
        contrastText: '#fff'
      }
    },
    spreadThis: {
      customTheme: {
        backgroundColor: themeContext.theme === 'dark' ? '#05020e' : '#eeeef4',
        secondaryBackgroundColor: themeContext.theme === 'dark' ? '#05031c' : '#f4f7f8',
        hoverColor: themeContext.theme === 'dark' ? '#221a2b' : 'rgb(250, 250, 251)'
      },
      formContainer: {
        width: '90%',
        maxWidth: '400px',
        margin: 'auto',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      },
      lock: {
        color: 'white',
        width: '40px',
        height: '40px',
        backgroundColor: 'rgb(220, 0, 78)',
        padding: '.5rem',
        borderRadius: '50%'
      },
      heading: {
        textAlign: 'center'
      },
      lockContainer: {
        textAlign: 'center'
      },
      form: {
        marginTop: '1rem'
      },
      textField: {
        margin: '10px 0'
      },
      submitBtn: {
        margin: '10px 0 10px 0',
        backgroundColor: '#1976d2'
      }
    }
  })

  const { onTryAutoLogin, authenticated, getAuthenticatedUserData, FBIdToken } = props;

  useEffect(() => {
    onTryAutoLogin(props.authRedirectPath, props.history)
  }, [onTryAutoLogin]);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if(theme === 'dark') {
      themeContext.setPreferredTheme('dark');
    } else if (theme === 'light') {
      themeContext.setPreferredTheme('light');
    }
  }, [themeContext])

  useEffect(() => {
    if(authenticated && FBIdToken) {
      getAuthenticatedUserData(FBIdToken);
    }
  }, [authenticated, FBIdToken, getAuthenticatedUserData])

  let attachedClasses = ['App'];
  if(themeContext.theme === 'dark') {
    attachedClasses = ['App', 'dark'];
  }

  const [showSidenav, setShowSideNav] = useState(false);

  const toggleSidenavDisplay = () => {
    setShowSideNav(!showSidenav);
  }

  let routes = (
    <Switch> 
      <Route path="/" exact component={Home} />
      <AuthRoute path="/login" exact component={Login} />
      <AuthRoute path="/signup" exact component={Signup} />
      <Route path="/users/:handle" exact component={User} />
      <Route path="/users/:handle/tweet/:tweetId" exact component={User} />
      <Route component={UnknownRoute} />
    </Switch>
  )

  if(props.authenticated) {
    routes = (
      <Switch>
        <Route path="/" exact component={Home} />
        <AuthRoute path="/login" exact component={Login} />
        <AuthRoute path="/signup" exact component={Signup} />
        <Route path="/logout" exact component={Logout} />
        <Route path="/users/:handle" exact component={User} />
        <Route path="/users/:handle/tweet/:tweetId" exact component={User} />
        <Route component={UnknownRoute} />
      </Switch>
    )
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CSSBaseline />
      <div className={attachedClasses.join(' ')}>
        {
          props.authenticated ? (
            <React.Fragment>
              <Topnav toggle={toggleSidenavDisplay} open={showSidenav}  />
              <Sidenav open={showSidenav} handleClose={toggleSidenavDisplay} />
            </React.Fragment>
          ) : null
        }
        { routes }
      </div>
    </MuiThemeProvider>
  );
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.authenticated,
    FBIdToken: state.auth.FBIdToken,
    authRedirectPath: state.auth.authRedirectPath
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoLogin: (path, history) => dispatch(actions.checkAuthState(path, history)),
    getAuthenticatedUserData: (token) => dispatch(actions.getUserData(token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
