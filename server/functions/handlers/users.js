const { user } = require('firebase-functions/lib/providers/auth');
const { admin, db, firebase } = require('../utility/admin');
const config = require('../utility/config');
const { validateSignupData, validateLoginData, reduceUserDetails } = require('../utility/validators');

exports.signup = (req, res) => {
  const newUser = {
    fullName: req.body.fullName,
    handle: req.body.handle.toLowerCase(),
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  }
  const { errors, valid } = validateSignupData(newUser);
  if(!valid) {
    console.error(errors);
    return res.status(400).json(errors);
  }

  const noImg = 'no-img.png';
  const backgroundImg = 'background-img.jpg'
  let token, userId;

  db.doc(`/users/${newUser.handle}`).get()
    .then(doc => {
      if(doc.exists) {
        return res.status(400).json({ handle: 'This handle is already taken' });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredentials = {
        fullName: newUser.fullName,
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
        followingCount: 0,
        followerCount: 0,
        imageUrl: `https://firebaseStorage.googleapis.com/v0/b/${config.storageBucket}/o/images%2F${noImg}?alt=media`,
        // backgoundUrl: `https://firebaseStorage.googleapis.com/v0/b/${config.storageBucket}/o/images%2F${backgroundImg}?alt=media`
      }
      return db.collection('users').doc(`${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if(err.code === 'auth/email-already-in-use') {
        return res.status(400).json({email: 'Email already in use'});
      }
      return res.status(500).json({ general: 'Something went wrong. Please try again' });
    });
}

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  }

  const { errors, valid } = validateLoginData(user);
  if(!valid) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      return res.status(400).json({ general: 'Something went wrong. Please try again' });
    });
}

exports.getFollowers = (req, res) => {
  const followers = [];
  db.collection('followers').where('following', '==', req.params.userHandle).get()
    .then(data => {
      data.forEach(doc => {
        followers.push(doc.data().follower);
      })
      return res.json(followers);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

exports.getFollowing = (req, res) => {
  const following = [];
  db.collection('followers').where('follower', '==', req.params.userHandle).get()
    .then(data => {
      data.forEach(doc => {
        following.push(doc.data().following);
      })
      return res.json(following);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

exports.addUserDetails = (req, res) => {
  const userDetails = reduceUserDetails(req.body);
  db.collection('users').doc(req.user.handle).update(userDetails)
    .then(() => {
      return res.json({ 
        message: 'Details added successfully',
        details: userDetails
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

exports.getUserDetails = (req, res) => {
  let userData = {};
  db.collection('users').doc(req.params.handle).get()
    .then(doc => {
      if(doc.exists) {
        userData.user = doc.data();
        return db.collection('tweets').where('userHandle', '==', req.params.handle)
        .orderBy('createdAt', 'desc').get();
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    })
    .then(data => {
      userData.tweets = [];
      data.forEach(doc => {
        userData.tweets.push({
          ...doc.data(),
          tweetId: doc.id
        });
      })
      return db.collection('followers').where('following', '==', req.params.handle).get()
    })
    .then(data => {
      userData.followers = [];
      data.forEach(doc => {
        userData.followers.push(doc.data().follower);
      })
      return db.collection('followers').where('follower', '==', req.params.handle).get()
    })
    .then(data => {
      userData.following = [];
      data.forEach(doc => {
        userData.following.push(doc.data().following);
      })
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

exports.getAuthenticatedUser = (req, res) => {
  let userData = {};
  return db.doc(`/users/${req.user.handle}`).get()
    .then(doc => {
      if(doc.exists) {
        userData.credentials = doc.data();
        return db.collection('likes').where('userHandle', '==', req.user.handle).get();
      } else {
        return res.status(404).json({ error: err.code });
      }
    })
    .then(data => {
      userData.likes = [];
      data.forEach(doc => {
        userData.likes.push(doc.data());
      })
      return db.collection('notifications').where('recipient', '==', req.user.handle)
      .orderBy('createdAt', 'desc').limit(10).get();
    })
    .then(data => {
      userData.notifications = [];
      data.forEach(doc => {
        userData.notifications.push({
          ...doc.data(),
          notificationId: doc.id
        })
      })
      return db.collection('followers').where('following', '==', req.user.handle).get()
    })
    .then(data => {
      userData.followers = [];
      data.forEach(doc => {
        userData.followers.push(doc.data().follower);
      })
      return db.collection('followers').where('follower', '==', req.user.handle).get()
    })
    .then(data => {
      userData.following = [];
      data.forEach(doc => {
        userData.following.push(doc.data().following);
      })
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

exports.uploadUserImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  let imageUrl;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if(mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      destination: `images/${imageFileName}`,
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      imageUrl = `https://firebaseStorage.googleapis.com/v0/b/${config.storageBucket}/o/images%2F${imageFileName}?alt=media`;
      db.doc(`/users/${req.user.handle}`).update({
        imageUrl,
        imageFileName 
      });
    })
    .then(() => {
      return res.json({
        message: 'Image uploaded successfully',
        imageUrl,
        imageFileName
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err.code});
    });
  });
  busboy.end(req.rawBody);
}

exports.uploadBackgroundImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  let backgroundUrl;

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if(mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }

    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on('finish', () => {
    admin.storage().bucket().upload(imageToBeUploaded.filepath, {
      destination: `images/${imageFileName}`,
      resumable: false,
      metadata: {
        metadata: {
          contentType: imageToBeUploaded.mimetype
        }
      }
    })
    .then(() => {
      backgroundUrl = `https://firebaseStorage.googleapis.com/v0/b/${config.storageBucket}/o/images%2F${imageFileName}?alt=media`;
      db.doc(`/users/${req.user.handle}`).update({
        backgroundUrl,
        backgroundImageFileName: imageFileName
      });
    })
    .then(() => {
      return res.json({
        message: 'Background image uploaded successfully',
        backgroundUrl,
        backgroundImageFileName: imageFileName
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({error: err.code});
    });
  });
  busboy.end(req.rawBody);
}

exports.markNotificationsRead = (req, res) => {
  const batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  })
  batch.commit()
    .then(() => {
      return res.json({ message: 'Notifications marked read' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err })
    })
}

//Follow a user
exports.followUser = (req, res) => {
  if(req.user.handle === req.params.userHandle) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  let followerCount;
  let followingCount;
  const followedUser = db.collection('users').doc(req.params.userHandle);
  const followingUser = db.collection('users').doc(req.user.handle);
  const followDocument = db.collection('followers')
  .where('follower', '==', req.user.handle)
  .where('following', '==', req.params.userHandle);

  followedUser.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'User does not exist' });
      }
      followerCount = doc.data().followerCount;
      return followDocument.get()
    })
    .then(data => {
      if(!data.empty) {
        return res.status(400).json({ error: 'Already following user' });
      }
      return followingUser.get()
      .then(async doc => {
        if(doc.exists) {
          followingCount = doc.data().followingCount;
          await db.collection('followers').add({
            follower: req.user.handle,
            following: req.params.userHandle
          });
          await followedUser.update({ followerCount: followerCount + 1 });
          await followingUser.update({ followingCount: followingCount + 1 });
          return res.json('Successfully followed user');
        }
      });
    })
    .catch(err => {
      console.error(error);
      return res.status(500).json({ error: err.code });
    })
}

//Unfollow user 
exports.unfollowUser = (req, res) => {
  if(req.user.handle === req.params.userHandle) {
    return res.status(400).json({ error: 'Cannot unfollow yourself' });
  }

  let followerCount;
  let followingCount;
  let followDocumentId;
  const followedUser = db.collection('users').doc(req.params.userHandle);
  const followingUser = db.collection('users').doc(req.user.handle);
  const followDocument = db.collection('followers')
  .where('follower', '==', req.user.handle)
  .where('following', '==', req.params.userHandle);

  followedUser.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'User does not exist' });
      }
      followerCount = doc.data().followerCount;
      return followDocument.get()
    })
    .then(data => {
      if(data.empty) {
        return res.status(400).json({ error: 'Not following this user yet' });
      }
      followDocumentId = data.docs[0].id;
      return followingUser.get()
      .then(async doc => {
        if(doc.exists) {
          followingCount = doc.data().followingCount;
          await db.collection('followers').doc(followDocumentId).delete();
          await followedUser.update({ followerCount: followerCount - 1 });
          await followingUser.update({ followingCount: followingCount - 1 });
          return res.json('Successfully unfollowed user');
        }
      })
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

//Save push subscription
exports.savePushSub = (req, res) => {
  db.collection('subscriptions').add({
    ...req.body,
    handle: req.user.handle
  })
  .then(() => {
    return res.json({ message: 'Successfully subscribed' })
  })
  .catch((err) => {
    console.error(err);
    return res.status(500).json({ error: err });
  })
}