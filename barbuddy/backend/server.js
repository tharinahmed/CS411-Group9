const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const admin = require('firebase-admin');
const serviceAccount = require('/Users/lukepemberton/Desktop/BU/Sem6/CS411/CS411-Group9/barbuddy/backend/keys/barbuddy-384704-firebase-adminsdk-bidsa-f71f2ff21e.json');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // can always change

const sessionSecret = crypto.randomBytes(64).toString('hex');

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000' //replace with your frontend domain
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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},
(accessToken, refreshToken, profile, done) => {
  // handle the authenticated user
}));

app.use(session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // successful authentication, redirect home
    res.redirect('/');
  });

app.post('/api/login', async (req, res) => {
  console.log('hello');
  const token = req.body.token;

  try {
    // verify the token
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

    // get the user ID
    const userId = decodedToken.uid;

    // access the database using the Firebase Admin SDK
    const databaseRef = firebaseAdmin.database().ref('/users/' + userId);

    // do something with the database reference

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Login failed' });
  }
});

app.get("/random", async (req, res) => {
  console.log("get req received!");
  try {
      const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
      res.json(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving data from API');
  }
});

app.post("/Favorites", cors(), async(req,res)=>{

})

app.post("/api/search", async(req,res)=>{
    console.log("post req received from search!");
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