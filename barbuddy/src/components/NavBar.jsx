import React from "react";

function NavBar() {
    return(
      <div className="navbar bg-background">
        <div className="flex-1 ml-3 text-2xl font-azeret-mono text-white">BarBuddy</div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li className="text-sm text-white"><a href="/discover">Discover</a></li>
            <li className="text-sm text-white"><a href="/random">Randomize</a></li>
          </ul>
        </div>
      </div>
    );
}
export default NavBar;
