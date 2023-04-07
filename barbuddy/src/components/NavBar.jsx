import React from "react";
import logo from './logo.png';

function NavBar() {
    return(
      <div className="navbar bg-background">
        <div className="flex-1 ml-5 mt-3 mb-3">
          <img src={logo} alt="BarBuddy" className="h-14 w-10" />
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li className="text-sm text-highlights"><a href="/discover">Discover</a></li>
            <li className="text-sm text-highlights"><a href="/random">Randomize</a></li>
          </ul>
        </div>
      </div>
    );
}
export default NavBar;
