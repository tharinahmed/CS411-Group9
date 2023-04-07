import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="App">
        <div class="hero min-h-screen">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <Link to="/random">
              <button className="btn">Randomize</button>
                </Link>
            </div>
          </div>
        </div>
        </div>
    );
  }
  
  export default HomePage;


