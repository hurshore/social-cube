import React, { useContext, useState } from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import { ThemeContext } from '../../../context/themeContext';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

//Components
import Notifications from '../../Notifications/Notifications';
//MUI Stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Switch from '@material-ui/core/Switch';
//Icons
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

const styles = (theme) => ({
  ...theme.spreadThis,
  home: {
    color: '#248bfc'
  },
  profile: {
    color: '#8d14b3'
  },
  notifications: {
    color: '#2025dc'
  },
  signOut: {
    color: 'red'
  },
  icon: {
    fontSize: '1.7rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  }
})

const NavigationItems = (props) => {
  const { classes } = props;
  const themeContext = useContext(ThemeContext);

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerIsOpen(!drawerIsOpen);
    if(!drawerIsOpen) {
      markNotificationsRead();
    }
  }

  const markNotificationsRead = () => {
    const unreadNotificationsIds = props.notifications
    .filter(notification => !notification.read)
    .map(notification => notification.notificationId);
    if(unreadNotificationsIds.length !== 0) {
      props.markNotificationsRead(unreadNotificationsIds, props.FBIdToken);
    }
  }

  return (
    <ul>
      <NavigationItem to="/" className={classes.home} textContent="Home">
        <HomeIcon className={classes.icon} />
      </NavigationItem>
      <NavigationItem to={`/users/${props.handle}`} className={classes.profile} textContent="Profile">{<PersonIcon className={classes.icon}  />}</NavigationItem>
      {/* <NavigationItem className={classes.notifications} textContent="Notifications">{<NotificationIcon className={classes.icon}  />}</NavigationItem> */}
      <NavigationItem className={classes.notifications} textContent="Notifications" clicked={toggleDrawer}>
        <Notifications className={classes.icon} open={drawerIsOpen} toggleDrawer={toggleDrawer} />
      </NavigationItem>
      <NavigationItem textContent="Toggle Theme">
        <Switch
          checked={themeContext.theme === 'dark' ? true : false}
          name="toggleTheme"
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={themeContext.toggleTheme}
        />
      </NavigationItem>
      <NavigationItem to="/logout" className={classes.signOut} textContent="Sign Out">
        <PowerSettingsNewIcon className={classes.icon}  />
      </NavigationItem>
    </ul>
  )
}

const mapStateToProps = (state) => {
  return {
    handle: state.user.credentials.handle,
    FBIdToken: state.auth.FBIdToken,
    notifications: state.user.notifications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    markNotificationsRead: (notificationIds, FBIdToken) => dispatch(actions.markUnreadNotifications(notificationIds, FBIdToken))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(NavigationItems));