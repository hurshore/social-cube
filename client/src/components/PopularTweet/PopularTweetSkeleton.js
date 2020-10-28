import React, { useContext } from 'react';
import Skeleton, {SkeletonTheme } from 'react-loading-skeleton';
import { ThemeContext } from '../../context/themeContext';
//MUI stuff
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  ...theme.spreadThis,
  tweet: {
    borderRadius: '.8rem',
    margin: '1rem 0',
    padding: '.5rem',
    backgroundColor: theme.spreadThis.customTheme.secondaryBackgroundColor
  },
  cardHeader: {
    padding: '.5rem 1rem'
  },
  cardFooter: {
    padding: '0 .5rem'
  },
  liked: {
    color: 'red'
  }
})

const PopularTweetSkeleton = (props) => {
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
          className={classes.cardHeader}
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
        <CardActions disableSpacing className={classes.cardFooter}>
          <Skeleton height={20} />
        </CardActions>
      </Card>
    </SkeletonTheme>
  )
}

export default withStyles(styles)(PopularTweetSkeleton);