import React from 'react';
import { connect } from 'react-redux';
import cubeLogo from '../../assets/images/cube-logo-128.png';
import { urlBase64ToUint8Array } from '../../shared/utility';

//Components
import Notification from './Notification/Notification';
//MUI stuff
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import withStyles from '@material-ui/core/styles/withStyles';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
//Icons
import NotificationIcon from '@material-ui/icons/Notifications';

const styles = (theme) => ({
  ...theme.spreadThis,
  badge: {
    '& span': {
      top: '-12px',
      right: '-7px'
    }
  },
  notificationDrawer: {
    minWidth: '300px',
  },
  empty: {
    padding: '.4rem'
  },
  notificationButton: {
    padding: '1rem 0',
    textAlign: 'center'
  }
})

const Notifications = (props) => {
  const { classes } = props;
  let notificationCount = 0;
  props.notifications.forEach(notification => {
    if(!notification.read) {
      notificationCount += 1;
    }
  })

  const enablePushNotifications = () => {
    window.Notification.requestPermission((result) => {
      if(result !== 'granted') {
        // Permission denied
      } else {
        // Permission granted
        configurePushSub();
      }
    })
  }

  const configurePushSub = () => {
    if(!('serviceWorker' in navigator)) {
      return;
    }
    let reg;
    navigator.serviceWorker.ready
      .then((swReg) => {
        reg = swReg;
        swReg.pushManager.getSubscription()
        .then((sub) => {
          if(sub === null) {
            // Create a subscription
            const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
            const convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: convertedVapidPublicKey
            })
            .then((newSub) => {
              return fetch('https://europe-west1-socialio-a0744.cloudfunctions.net/api/push-notification', {
                method: 'POST',
                headers: {
                  'Authorization': props.FBIdToken,
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(newSub)
              })
            })
            .then((res) => {
              if(res.ok) {
                showConfirmedNotification();
              } else {
                res.json()
                  .then((err) => {
                    throw err;
                  })
              }
            })
          }
        })
        .catch((err) => {
          console.log(err);
        })
      })
  }

  const showConfirmedNotification = () => {
    if('serviceWorker' in navigator) {
      const options = {
        body: 'Successfully subscribed to our notification service',
        icon: cubeLogo,
        dir: 'ltr',
        lang: 'en-US',
        badge: cubeLogo,
        vibrate: [100, 50, 200],
        tag: 'confirm-notification',
        renotify: true
      }
      navigator.serviceWorker.ready
        .then((swReg) => {
          swReg.showNotification('Successfully subsribed', options);
        })
    }
  }

  return (
    <React.Fragment>
      <Badge badgeContent={notificationCount} color="secondary" className={classes.badge}>
        <NotificationIcon className={props.className} />
      </Badge>
      <SwipeableDrawer
        anchor='right'
        open={props.open}
        onClose={props.toggleDrawer}
        onOpen={props.toggleDrawer}
      >
        <div className={classes.notificationDrawer}>
          <div className={classes.notificationButton}>
            <Button color="primary" variant="contained" onClick={enablePushNotifications}>Enable Push Notifications</Button>
          </div>
          {props.notifications.length > 0 ?
            props.notifications.map((notification) => (
              <Notification 
                key={notification.notificationId} 
                type={notification.type}
                sender={notification.sender}
                recipient={notification.recipient}
                tweetId={notification.tweetId}
                createdAt={notification.createdAt}
                read={notification.read}
              />
            )
            ) : <Typography variant="body1" className={classes.empty}>Nothing to see here<span role="img" aria-label="eyes">👀</span></Typography>
          }
        </div>
      </SwipeableDrawer>
    </React.Fragment>
  )
}



const mapStateToProps = (state) => {
  return {
    notifications: state.user.notifications,
    FBIdToken: state.auth.FBIdToken
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Notifications));