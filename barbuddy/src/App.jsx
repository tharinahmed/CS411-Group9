import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import NavBar from './components/NavBar';
import Randomize from "./components/Randomize";
import Discover from "./components/Discover";
import SignIn from "./components/SignIn";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-azeret-mono">
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Discover />} />
          <Route exact path="/random" element={<Randomize />} />
          <Route exact path="/discover" element={<Discover />} />
        </Routes>
      </BrowserRouter>
      <SignIn />
    </div>
  );
}

export default App;