// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsHKeJ9VCvxXlgDSVG31j-y6bhERIB0j8",
  authDomain: "barbuddy-64ead.firebaseapp.com",
  projectId: "barbuddy-64ead",
  storageBucket: "barbuddy-64ead.appspot.com",
  messagingSenderId: "345160461938",
  appId: "1:345160461938:web:724ffd2db8c3e1cbe81ceb",
  measurementId: "G-HYCLB93NS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);