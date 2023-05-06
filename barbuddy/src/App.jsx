import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import NavBar from './components/NavBar';
import Randomize from "./components/Randomize";
import Discover from "./components/Discover";
import Search from "./components/Search";
import Favorites from "./components/Favorites";
import ShoppingList from "./components/ShoppingList";

function App() {
  return (
    <div className="font-azeret-mono">
      <NavBar />
      <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Discover />} />
        <Route exact path="/random" element={<Randomize />} />
        <Route exact path="/discover" element={<Discover />} />
        <Route exact path="/search" element={<Search />} /> 
        <Route exact path="/favorites" element={<Favorites />} />
        <Route exact path="/shoppinglist" element={<ShoppingList />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
