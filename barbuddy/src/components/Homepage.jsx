import React from "react";
import Cards from "./Cards";
import Search from "./Search";

function HomePage() {
    return (
        <div className="App">
        <div class="hero min-h-screen">
          <div class="hero-content text-center">
            <div class="max-w-md">
              <Cards />
            </div>
          </div>
        </div>
        </div>
    );
  }
  
  export default HomePage;


