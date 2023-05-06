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
  admin.auth().getUser(profile.id).then(userRecord => {
    done(null, userRecord.toJSON());
  }).catch(error => {
    if (error.code === 'auth/user-not-found') {
      admin.auth().createUser({
        uid: profile.id
      }).then(userRecord => {
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
  const key = Object.keys(sessionData)[0]; 
  const obj = JSON.parse(sessionData[key]);
  const user = obj.passport.user;
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
    req.login(req.user, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

    res.redirect('http://localhost:3000/discover');
    });
  });

// Define route for logging out
app.post('/logout', (req, res) => {
  req.logOut(); // make sure to give this a callback
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

app.get("/ShoppingList/get", ensureAuthenticated, async(req,res)=>{
  try {
    const sessionData = req.sessionStore.sessions;
    const key = Object.keys(sessionData)[0]; // assuming there is only one key in the session object
    const obj = JSON.parse(sessionData[key]); // parsing the JSON object into a JavaScript object
    const user = obj.passport.user;
    const uid = user.uid;

    // Access the user's data in the Firebase Realtime Database
    const keyVal = 'shoppingList';
    const userRef = admin.database().ref('users/' + uid);
    const newData = { [keyVal]: [] };

    // Get userdata from database

    userRef.once('value').then((snapshot) => {
      const userData = snapshot.val();
      if (userData && [keyVal] in userData) {
        const shoppingList = Object.values(userData[keyVal]);
        const shoppingListComp = {};
        const promises = [];

        for (const queryTerm of shoppingList) {
          const promise = axios.get(
            "https://serpapi.com/search.json?q=" + queryTerm + "&engine=google_images&ijn=0&api_key=" + process.env.SERPAPI_KEY
          ).then(response => {
            const queryData = response.data.images_results[0];
            const imageUrl = queryData.thumbnail;
            shoppingListComp[queryTerm] = imageUrl;
          }).catch(error => {
            console.log(error);
          });

          promises.push(promise);
        }

        Promise.all(promises).then(() => {
          console.log(shoppingListComp);
          res.json(shoppingListComp);
        });
      } else {
        userRef.update(newData).then(() => {
          console.log("added shopping list to user", uid);
        })
        res.json({});
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error retrieving shopping list from database');
  }
})

app.post("/ShoppingList/add", ensureAuthenticated, async(req,res)=>{
  try {
    const sessionData = req.sessionStore.sessions;
    const key = Object.keys(sessionData)[0]; 
    const obj = JSON.parse(sessionData[key]);
    const user = obj.passport.user;
    const uid = user.uid;

    // Post the user's data to the Firebase Realtime Database
    const data = req.body.ingredient.ingredient;
    const keyVal = 'shoppingList';
    const userRef = admin.database().ref('users/' + uid);
    const newData = { [keyVal]: [data] };
    
    // Check if the data already exists in the database
    userRef.once('value').then((snapshot) => {
      const userData = snapshot.val();
      if (userData && [keyVal] in userData) {
        const oldData = userData[keyVal];
        if (oldData && Object.values(oldData).includes(data)) {
          console.log("ingredient already there!")
          res.sendStatus(201);
        } else {
          userRef.child(keyVal).push(data).then(() => {
            console.log('added new data to the shopping list!');
            res.sendStatus(200);
          })
        }
      } else {
        newData[keyVal].push(data);
        userRef.update(newData).then(() => {
          console.log('ooo new data in the shopping list!');
          res.sendStatus(200);
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error posting to shopping list in database');
  }
})

app.get("/Favorites", ensureAuthenticated, async(req,res)=>{
  try {
    const sessionData = req.sessionStore.sessions;
    const key = Object.keys(sessionData)[0];
    const obj = JSON.parse(sessionData[key]);
    const user = obj.passport.user;
    const uid = user.uid;

    // Access the user's data in the Firebase Realtime Database
    const userRef = admin.database().ref('users/' + uid);

    // Get userdata from database
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
    const key = Object.keys(sessionData)[0];
    const obj = JSON.parse(sessionData[key]);
    const user = obj.passport.user;
    const uid = user.uid;

    const data = req.body;
    const keyVal = data.strDrink.toString();
    const newData = { [keyVal]: data };

    // Access the user's data in the Firebase Realtime Database
    const userRef = admin.database().ref('users/' + uid);

    // Check if the data already exists in the database
    userRef.once('value').then((snapshot) => {
      const userData = snapshot.val();
      if (userData && [keyVal] in userData) {
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