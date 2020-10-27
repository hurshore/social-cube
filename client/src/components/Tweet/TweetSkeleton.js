import React, { useContext } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ThemeContext } from '../../context/themeContext';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  ...theme.spreadThis,
  tweet: {
    marginTop: '1.2rem',
    maxWidth: '500px',
    margin: 'auto',
    backgroundColor: theme.spreadThis.customTheme.backgroundColor,
    borderRadius: '.8rem'
  },
  body: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  cardFooter: {
    padding: '.4rem'
  }
})

const TweetSkeleton = (props) => {
  const { classes } = props;
  const themeContext = useContext(ThemeContext);
  let skeletonColor = '#edebed';
  let skeletonHightlightColor = '#fff';
  if(themeContext.theme === 'light') {
    skeletonColor = '#202020';
    skeletonHightlightColor = '#444';
  }

  return (
    <SkeletonTheme color={skeletonColor} highlightColor={skeletonHightlightColor}>
      <Card className={classes.tweet}>
        <CardHeader
          avatar={
            <Skeleton circle={true} height={50} width={50} />
          }
          title={
            <Typography>
              <Skeleton width={60} />
            </Typography>
          }
          subheader={
            <Skeleton width={100} />
          }
        />
        <div>
          <Skeleton height={250} />
        </div>
        <CardContent>
          <Typography variant="body2" component="p" className={classes.body}>
            <Skeleton width={200} />
          </Typography>
        </CardContent>
        <hr />
        <CardActions disableSpacing className={classes.cardFooter}>
          <Skeleton width={'70%'} />
        </CardActions>
      </Card>
    </SkeletonTheme>
  )
}

export default withStyles(styles)(TweetSkeleton);