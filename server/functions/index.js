const functions = require('firebase-functions');
const app = require('express')();
const { db } = require('./utility/admin');
require('firebase/storage');
const cors = require('cors');
app.use(cors({origin: true}))

const {
  getAllTweets,
  getTweet,
  getPopularTweets,
  postOneTweet,
  deleteTweet,
  likeTweet,
  unlikeTweet,
  commentOnTweet,
  deleteComment
} = require('./handlers/tweets');
const {
  signup,
  login,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  addUserDetails,
  uploadUserImage,
  uploadBackgroundImage,
  markNotificationsRead,
  getUserDetails,
  getAuthenticatedUser
} = require('./handlers/users');
const FBAuth = require('./utility/FBAuth');
const { admin } = require('./utility/admin');

//Tweet routes
app.get('/tweets', getAllTweets);
app.get('/tweet/:tweetId', getTweet);
app.get('/tweets/popular', getPopularTweets);
app.post('/tweet', FBAuth, postOneTweet);
app.delete('/tweet/:tweetId', FBAuth, deleteTweet);
app.get('/tweet/:tweetId/like', FBAuth, likeTweet);
app.get('/tweet/:tweetId/unlike', FBAuth, unlikeTweet);
app.post('/tweet/:tweetId/comment', FBAuth, commentOnTweet);
app.delete('/tweet/:tweetId/comment/:commentId', FBAuth, deleteComment);

//User authentication routes
app.post('/signup', signup);
app.post('/login', login);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.get('/user/:userHandle/follow', FBAuth, followUser);
app.get('/user/:userHandle/unfollow', FBAuth, unfollowUser);
app.get('/user/:userHandle/followers', getFollowers);
app.get('/user/:userHandle/following', getFollowing);
app.post('/user', FBAuth, addUserDetails);
app.post('/user/image', FBAuth, uploadUserImage);
app.post('/user/background-image', FBAuth, uploadBackgroundImage);
app.post('/notifications', FBAuth, markNotificationsRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.onTweetDelete = functions.firestore.document('tweets/{tweetId}')
  .onDelete((snapshot, context) => {
    let tweetId = context.params.tweetId;
    console.log(tweetId);
    const batch = db.batch();
    const bucket = admin.storage().bucket();
    return bucket.file(`images/${snapshot.data().tweetImageFileName}`).delete()
      .then(() => {
        return db.collection('likes').where('tweetId', '==', tweetId).get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        })
        return db.collection('comments').where('tweetId', '==', tweetId).get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        })
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  })

exports.createNotificationOnLike = functions.firestore.document('likes/{id}')
  .onCreate(snapshot => {
    return db.doc(`/tweets/${snapshot.data().tweetId}`).get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            tweetId: doc.id,
            type: 'like',
            read: false,
            createdAt: new Date().toISOString()
          })
        }
      })
      .catch(err => {
        console.error('Something went wrong', err);
      });
  })

exports.deleteNotificationOnUnlike = functions.firestore.document('likes/{id}')
  .onDelete(snapshot => {
    return db.doc(`/notifications/${snapshot.id}`).delete()
    .catch(err => console.error(err));
  })

exports.createNotificationOnComment = functions.firestore.document('comments/{id}')
  .onCreate(snapshot => {
    return db.doc(`/tweets/${snapshot.data().tweetId}`).get()
      .then(doc => {
        if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            tweetId: doc.id,
            type: 'comment',
            read: false,
            createdAt: new Date().toISOString()
          })
        }
      })
      .catch(err => console.error({ message: 'Something went wrong', error: err.code }));
  })

exports.deleteNotificationOnCommentDelete = functions.firestore.document('comments/{id}')
  .onDelete(snapshot => {
    return db.doc(`/notifications/${snapshot.id}`).delete()
    .catch(err => console.error(err));
  })

exports.createNotificationOnFollow = functions.firestore.document('followers/{id}')
  .onCreate(snapshot => {
    return db.doc(`/users/${snapshot.data().following}`).get()
      .then(doc => {
        if(doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: snapshot.data().following,
            sender: snapshot.data().follower,
            type: 'follow',
            read: false,
            createdAt: new Date().toISOString()
          })
        }
      })
      .catch(err => console.error(err));
  })

exports.deleteNotificationOnUnfollow = functions.firestore.document('followers/{id}')
  .onDelete(snapshot => {
    return db.doc(`/notifications/${snapshot.id}`).delete()
    .catch(err => console.error(err));
  })

exports.onUserImageChange = functions.firestore.document('users/{userId}')
  .onUpdate(change => {
    if(change.before.data().imageUrl !== change.after.data().imageUrl) {
      const batch = db.batch();
      const bucket = admin.storage().bucket();

      return db.collection('tweets').where('userHandle', '==', change.before.data().handle).get()
        .then(data => {
          data.forEach(doc => {
            const tweet = db.doc(`/tweets/${doc.id}`);
            batch.update(tweet, { userImageUrl: change.after.data().imageUrl });
          })
          return db.collection('comments').where('userHandle', '==', change.before.data().handle).get()
        })
        .then(data => {
          data.forEach(doc => {
            const comment = db.doc(`/comments/${doc.id}`);
            batch.update(comment, { imageUrl: change.after.data().imageUrl });
          })
          return batch.commit();
        })
        .then(() => {
          if(change.before.data().imageFileName !== 'no-img.png') {
            return bucket.file(`images/${change.before.data().imageFileName}`).delete();
          }
        })
        .catch(err => console.error(err));
    }
  })

exports.onBackgroundImageChange = functions.firestore.document('users/{userId}')
  .onUpdate(change => {
    if(change.before.data().backgroundUrl !== change.after.data().backgroundUrl && change.before.data().backgroundImageFileName !== 'background-img.jpg') {
      const bucket = admin.storage().bucket();

      return bucket.file(`images/${change.before.data().backgroundImageFileName}`).delete()
        .catch(err => console.error(err));
    }
  })