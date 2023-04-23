import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import NavBar from './components/NavBar';
import Randomize from "./components/Randomize";
import Discover from "./components/Discover";

function App() {
  return (
    <div className="font-azeret-mono">
      <NavBar />
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Discover />} />
        <Route exact path="/random" element={<Randomize />} />
        <Route exact path="/discover" element={<Discover />} />
        {/* <Route exact path="/my recipes" element={<Discover />} /> 
        <Route exact path="/shopping list" element={<Discover />} /> */}
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
