import React from 'react';
import { connect } from 'react-redux';

//Components
import Notification from './Notification/Notification';
//MUI stuff
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import withStyles from '@material-ui/core/styles/withStyles';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
//Icons
import NotificationIcon from '@material-ui/icons/Notifications';

const styles = (theme) => ({
  ...theme.spreadThis,
  badge: {
    '& span': {
      top: '-12px',
      right: '-7px'
    }
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
          ) : <Typography variant="p">Nothing to see here<span role="img" aria-label="eyes">👀</span></Typography>
        }
      </SwipeableDrawer>
    </React.Fragment>
  )
}



const mapStateToProps = (state) => {
  return {
    notifications: state.user.notifications
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Notifications));