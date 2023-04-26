import React, { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';

function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedLoginStatus = localStorage.getItem('loggedIn');
    if (storedLoginStatus) {
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    // Store login status in local storage
    localStorage.setItem('loggedIn', 'true');
    setLoggedIn(true);
    const token = credentialResponse;
    console.log(token);

    // send the token to the backend server
    const response = fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      setLoggedIn(true);
    } else {
      console.log('Login failed');
    }
  }

  const handleLoginFailure = (error) => {
    console.log('Login Failed', error);
  }

  const handleLogout = () => {
    // Remove login status from local storage
    localStorage.removeItem('loggedIn');
    setLoggedIn(false);
  }

  const clientID='35199761323-iulfqrvu1aonnp9mtcdqlbctmjmphm0f.apps.googleusercontent.com';

  const loginButton = (    
    <GoogleOAuthProvider clientId={clientID}>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onFailure={handleLoginFailure}
      />
    </GoogleOAuthProvider>
  )

  return(
  <div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
      </label>
      <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
        <li><a href="/discover">Discover</a></li>
        <li><a href="/random">Randomize</a></li>
        <li><a href="/favorites">Favorites</a></li>
      </ul>
    </div>
  </div>
  <div className="navbar-center">
    <a className="btn btn-ghost normal-case text-3xl" href="/">BarBuddy</a>
  </div>
  <div className="navbar-end">
  <div>
    {!loggedIn ? loginButton : <><h3 style={{ paddingLeft: 100, color: "#ffffff" }}>Logged In!</h3><button onClick={() => handleLogout()}>logout</button></>}
  </div>
  <div> {/* add styling to the pop up search */}
    <a href="/search">
      <button className="btn btn-ghost btn-circle">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
    </a>
    </div>
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button>
    </div>
    </div>
  );
}
export default NavBar;
