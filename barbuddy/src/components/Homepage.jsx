import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="App font-azeret-mono">
        <div className="hero min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <Link to="/random">
              <button className="btn">Randomize Drink</button>
                </Link>
            </div>
          </div>
        </div>
        </div>
    );
  }
  
  export default HomePage;


