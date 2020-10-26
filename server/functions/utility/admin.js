const admin = require('firebase-admin');
const firebase = require('firebase');
const firebaseConfig = require('./config');
const serviceAccount = require('../firebaseAuth.json');

firebase.initializeApp(firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL,
  storageBucket: firebaseConfig.storageBucket
});
const db = admin.firestore();

module.exports = { admin, db, firebase };