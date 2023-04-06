import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import React from "react";
import HomePage from './components/Homepage';
import NavBar from './components/NavBar';
import Randomize from "./components/Randomize";
import Discover from "./components/Discover";


function App() {
  return (
    <div>
      <NavBar />
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/random" element={<Randomize />} />
        <Route exact path="/discover" element={<Discover />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
