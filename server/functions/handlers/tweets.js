const { db, admin } = require('../utility/admin');
const config = require('../utility/config');

//Get all tweets;
exports.getAllTweets = (req, res) => {
  db.collection('tweets')
  .orderBy('createdAt', 'desc').get()
  .then(data => {
    let tweets = [];
    data.forEach(doc => {
      tweets.push({
        tweetId: doc.id,
        ...doc.data()
      })
    })
    return res.json(tweets);
  }).catch(err => {
    console.error(err);
    return res.status(400).json({ error: err.code });
  })
}

//Get one tweet
exports.getTweet = (req, res) => {
  let tweetData = {};

  db.doc(`/tweets/${req.params.tweetId}`).get()
  .then(doc => {
    if(!doc.exists) {
      return res.status(404).json({ error: 'Tweet not found' });
    }
    tweetData = doc.data();
    tweetData.tweetId = doc.id;
    return db.collection('comments')
    .where('tweetId', '==', req.params.tweetId)
    .orderBy('createdAt', 'asc')
    .get();
  })
  .then(data => {
    tweetData.comments = [];
    data.forEach(doc => {
      tweetData.comments.push({
        ...doc.data(),
        commentId: doc.id
      });
    })
    return res.json(tweetData);
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({ error: err.code });
  });
}

exports.getPopularTweets = (req, res) => {
  db.collection('tweets').get()
    .then(data => {
      const tweets = [];
      data.forEach(doc => {
        tweets.push({
          tweetId: doc.id,
          ...doc.data()
        });
      })
      tweets.sort((a, b) => {
        if((a.likeCount + a.commentCount) > (b.likeCount + b.commentCount)) return -1;
        if((a.likeCount + a.commentCount) < (b.likeCount + b.commentCount)) return 1;
        return 0
      })
      const newTweets = tweets.slice(0, 3)
      return res.json(newTweets);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

exports.postOneTweet = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};
  let newTweet = {};

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    if(val.trim() === '') {
      errors.body = 'Must not be empty';
    }

    newTweet = {
      body: val,
      createdAt: new Date().toISOString(),
      userHandle: req.user.handle,
      commentCount: 0,
      likeCount: 0,
      userImageUrl: req.user.imageUrl,
    }
  });

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if(mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return res.status(400).json({ error: 'Wrong file type submitted' });
    }
    
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
    imageFileName = `${Math.round(Math.random() * 1000000000000)}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  })
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
      const imageUrl = `https://firebaseStorage.googleapis.com/v0/b/${config.storageBucket}/o/images%2F${imageFileName}?alt=media`;
      newTweet.tweetImageUrl = imageUrl;
      newTweet.tweetImageFileName = imageFileName;
      db.collection('tweets').add(newTweet)
      .then(doc => {
        newTweet.tweetId = doc.id;
        return res.json(newTweet);
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({error: err.code});
      });
    })
  });
  busboy.end(req.rawBody);
}

exports.deleteTweet = (req, res) => {
  const document = db.doc(`/tweets/${req.params.tweetId}`)
  
  document.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Tweet not found' });
      }
      if(doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: 'Tweet deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
}

exports.likeTweet = (req, res) => {
  const tweetDocument = db.doc(`tweets/${req.params.tweetId}`);
  const likeDocument = db.collection('likes')
  .where('userHandle', '==', req.user.handle)
  .where('tweetId', '==', req.params.tweetId)
  .limit(1);

  let tweetData = {};

  tweetDocument.get()
    .then(doc => {
      if(doc.exists) {
        tweetData = doc.data();
        tweetData.tweetId = doc.id;
        return likeDocument.get()
      } else {
        return res.status(404).json({ error: 'Tweet not found' });
      }
    })
    .then(data => {
      if(data.empty) {
        return db.collection('likes').add({
          tweetId: req.params.tweetId,
          userHandle: req.user.handle
        })
        .then(() => {
          tweetData.likeCount++
          return tweetDocument.update({ likeCount: tweetData.likeCount })
        })
        .then(() => {
          return res.json(tweetData);
        })
      } else {
        return res.status(400).json({ error: 'Tweet already liked' });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    }); 
}

exports.unlikeTweet = (req, res) => {
  const tweetDocument = db.doc(`tweets/${req.params.tweetId}`);
  const likeDocument = db.collection('likes')
  .where('userHandle', '==', req.user.handle)
  .where('tweetId', '==', req.params.tweetId)
  .limit(1);

  let tweetData = {};

  tweetDocument.get()
    .then(doc => {
      if(doc.exists) {
        tweetData = doc.data();
        tweetData.tweetId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'Tweet not found' });
      }
    })
    .then(data => {
      if(data.empty) {
        return res.status(400).json({ error: 'Tweet not yet liked' });
      } else {
        return db.collection('likes').doc(data.docs[0].id).delete()
        .then(() => {
          tweetData.likeCount--
          return tweetDocument.update({ likeCount: tweetData.likeCount });
        })
        .then(() => {
          return res.json(tweetData);
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

exports.commentOnTweet = (req, res) => {
  if(req.body.body.trim() === '') {
    return res.status(400).json({ comment: 'Must not be empty' });
  }

  const tweetDocument = db.doc(`tweets/${req.params.tweetId}`);
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    imageUrl: req.user.imageUrl,
    userHandle: req.user.handle,
    tweetId: req.params.tweetId
  }
  let commentCount;

  tweetDocument.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Tweet not found' });
      }
      commentCount = doc.data().commentCount;
      return db.collection('comments').add(newComment);
    })
    .then((doc) => {
      newComment.commentId = doc.id;
      return tweetDocument.update({ commentCount: commentCount + 1 });
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}

exports.deleteComment = (req, res) => {
  const tweetDocument = db.doc(`tweets/${req.params.tweetId}`);
  const commentDocument = db.doc(`comments/${req.params.commentId}`);
  let commentCount;

  tweetDocument.get()
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Tweet not found' });
      }
      commentCount = doc.data().commentCount
      return db.collection('comments').doc(req.params.commentId).get();
    })
    .then(doc => {
      if(!doc.exists) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      if(doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return commentDocument.delete()
        .then(() => {
          return tweetDocument.update({ commentCount: commentCount - 1 });
        })
        .then(() => {
          return res.json('Comment deleted successfully');
        });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    })
}