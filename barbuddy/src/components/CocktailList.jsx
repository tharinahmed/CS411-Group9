/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";

const CocktailList = () => {
  const [cocktails, setCocktails] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");

  useEffect(() => {
    const fetchCocktails = async () => {
      const response = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${selectedFilter === "All" ? "" : selectedFilter}`
      );
      const data = await response.json();
      setCocktails(data.drinks);
    };

    fetchCocktails();
  }, [selectedFilter]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-azeret-mono">
      <div className="mb-6">
        <div className="dropdown dropdown-bottom">
          <label tabIndex={0} className="btn m-1 bg-transparent lowercase text-highlights">Filter</label>
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li>
              <a onClick={() => setSelectedFilter("All")}>All</a>
            </li>
            <li>
              <a onClick={() => setSelectedFilter("Alcoholic")}>Alcoholic</a>
            </li>
            <li>
              <a onClick={() => setSelectedFilter("Non_Alcoholic")}>Non-Alcoholic</a>
            </li>
          </ul>
        </div>
      </div>
      {cocktails.map((cocktail) => (
        <div className="card w-96 bg-base-100 shadow-xl mb-6" key={cocktail.idDrink}>
          <figure className="h-43 w-full overflow-hidden">
            <img
              src={cocktail.strDrinkThumb}
              alt={cocktail.strDrink}
              className="w-full h-full object-cover object-center"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{cocktail.strDrink}</h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CocktailList;
