// server/firebase.js
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use a service account
  });
}

const db = admin.firestore();
module.exports = { db };
