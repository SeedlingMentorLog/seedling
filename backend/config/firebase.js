const admin = require("firebase-admin");
require("dotenv").config({ path: __dirname + "/../.env" });

const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});