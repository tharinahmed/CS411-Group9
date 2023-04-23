import React, { useState } from "react";
import axios from 'axios';

function NavBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/search', { term: searchTerm });
      setSearchResults(response.data);
      setShowPopup(true); // set showPopup to true to display the popup
    } catch (error) {
      console.error(error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

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
      </ul>
    </div>
  </div>
  <div className="navbar-center">
    <a className="btn btn-ghost normal-case text-3xl" href="/">BarBuddy</a>
  </div>
  <div className="navbar-end">
  <div> {/* add styling to the pop up search */}
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setShowForm(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </button>
      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      )}
      {showPopup && ( // display the popup only when showPopup is true
        <div className="popup">
          <div className="popup-content">
            <ul>
              {searchResults.map((result) => (
                <div className="card w-96 bg-base-100 shadow-xl mb-6" key={result.idDrink}>
                <figure className="h-43 w-full overflow-hidden">
                  <img
                    src={result.strDrinkThumb}
                    alt={result.strDrink}
                    className="w-full h-full object-cover object-center"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{result.strDrink}</h2>
                </div>
              </div>
              ))}
            </ul>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
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
