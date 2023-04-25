import React, { useState } from "react";
import axios from 'axios';

function Search() {
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
    <div className="search">
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
        </div>
    );
}

export default Search;