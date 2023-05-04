const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const serviceAccount = require('/Users/lukepemberton/Desktop/BU/Sem6/CS411/CS411-Group9/barbuddy/backend/keys/barbuddy-384704-firebase-adminsdk-bidsa-f71f2ff21e.json');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // can always change

const sessionSecret = crypto.randomBytes(64).toString('hex');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT',
  allowedHeaders: ['Authorization', 'Content-Type'],
  exposedHeaders: ['Authorization'],
  credentials: true
}));

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://barbuddy-384704-default-rtdb.firebaseio.com'
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  // session.accessToken = accessToken;
  // handle the authenticated user
  // Retrieve or create user in Firebase Auth with the user ID from the Google profile
  admin.auth().getUser(profile.id).then(userRecord => {
    console.log('Existing user:', userRecord.toJSON());
    // Set the passport user field with the user record
    // You can access the user object using `req.user` in the route handlers
    done(null, userRecord.toJSON());
  }).catch(error => {
    if (error.code === 'auth/user-not-found') {
      // If the user doesn't exist in Firebase Auth, create a new user with the user ID from the Google profile
      admin.auth().createUser({
        uid: profile.id
      }).then(userRecord => {
        // console.log('New user:', userRecord.toJSON());
        // Set the passport user field with the user record
        // You can access the user object using `req.user` in the route handlers
        done(null, userRecord.toJSON());
      }).catch(error => {
        console.error('Error creating user:', error);
        done(error);
      });
    } else {
      console.error('Error fetching user:', error);
      done(error);
    }
  });
}));

app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));

passport.serializeUser((user, done) => {
  process.nextTick(function() {done(null, user);});
});

passport.deserializeUser((user, done) => {
  process.nextTick(function() {done(null, user);});
});

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  console.log("Checking authentication status");
  const sessionData = req.sessionStore.sessions;
  const key = Object.keys(sessionData)[0]; // assuming there is only one key in the session object
  const obj = JSON.parse(sessionData[key]); // parsing the JSON object into a JavaScript object
  const user = obj.passport.user;
  // console.log("user data", user); // accessing the display name of the user
  // console.log("is authenticated", req.isAuthenticated())
  if (user !== {} || user !== undefined || req.isAuthenticated()) {
    console.log("logged in");
    return next();
  } else {
    res.status(401).send('Unauthorized');
    console.log("not logged in!");
  }
  
};

app.get('/auth/google',
  passport.authenticate('google', { prompt: 'consent', scope: ['profile'] }), function(req, res) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  });

app.get('/auth/google/callback',
  passport.authenticate('google', { prompt: 'consent', failureRedirect: 'http://localhost:3000/discover' }),
  (req, res) => {
    // Generate a JWT for the authenticated user
    // const token = jwt.sign({ userId: req.user.uid }, process.env.JWT_SECRET);
    req.login(req.user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

    // Set the JWT in the client storage using cookies or localStorage
    // res.cookie('jwt', token, { httpOnly: true }); // Example using cookies
    res.redirect('http://localhost:3000/discover');
    });
  });

// Define route for logging out
app.post('/logout', (req, res) => {
  req.logOut();
  req.session.destroy();
  res.redirect('http://localhost:3000/discover');
  console.log("logged out!");
});

app.get("/random", async (req, res) => {
  try {
      const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving data from API');
  }
});

app.get("/Favorites", ensureAuthenticated, async(req,res)=>{
  try {
    const sessionData = req.sessionStore.sessions;
    const key = Object.keys(sessionData)[0]; // assuming there is only one key in the session object
    const obj = JSON.parse(sessionData[key]); // parsing the JSON object into a JavaScript object
    const user = obj.passport.user;
    const uid = user.uid;

    // make sure to change it to serializing an ID token instead of the user id up in the strategy !
    // Verify the ID token and get the user's information
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const uid = decodedToken.uid;

    // Access the user's data in the Firebase Realtime Database
    const userRef = admin.database().ref('users/' + uid);

    // Check if the data already exists in the database
    userRef.once('value').then((snapshot) => {
      const userData = snapshot.val();
      res.json(userData);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving data from database');
  }
})

app.post("/user/add", ensureAuthenticated, async(req,res)=>{
  try {
    const sessionData = req.sessionStore.sessions;
    const key = Object.keys(sessionData)[0]; // assuming there is only one key in the session object
    const obj = JSON.parse(sessionData[key]); // parsing the JSON object into a JavaScript object
    const user = obj.passport.user;
    const uid = user.uid;

    // deal with the cocktail recipe to add
    const data = req.body;
    const keyVal = data.strDrink.toString();
    const newData = { [keyVal]: data };

    // make sure to change it to serializing an ID token instead of the user id up in the strategy !
    // Verify the ID token and get the user's information
    // const decodedToken = await admin.auth().verifyIdToken(idToken);
    // const uid = decodedToken.uid;

    // Access the user's data in the Firebase Realtime Database
    const userRef = admin.database().ref('users/' + uid);

    // Check if the data already exists in the database
    userRef.once('value').then((snapshot) => {
      const userData = snapshot.val();
      if (userData && [keyVal] in userData) { // check if the key is in the user's data
        console.log("Key already exists!");
        res.sendStatus(200);
      } else {
        userRef.update(newData).then(() => {
          console.log('ooo new data!');
          res.sendStatus(200);
        });
      }
    });
  } catch (error) {
    console.error(error);
    console.log('oops');
    res.status(500).send('Error adding data to database');
  }
})

app.post("/api/search", async(req,res)=>{
    const searchTerm = req.body.term;
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchTerm;
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const filteredResults = data.drinks || [];
        res.json(filteredResults);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching search results from API');
    }
})

app.get("/filter", async(req,res)=>{
  const filter = req.query.filter || '';
  try {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${filter}`);
    const data = response.data;
    // Return the filtered cocktails to the client
    const filteredResults = data.drinks || [];
    res.json(filteredResults);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

app.listen(PORT, () => {
    console.log('server running on port: ' + PORT);
});