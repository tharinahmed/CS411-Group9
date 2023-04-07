import React, { useState, useEffect } from 'react';

const RandomCocktail = () => {
  const [cocktail, setCocktail] = useState(null);
  const [showDescription, setShowDescription] = useState(false);

  const fetchRandomCocktail = async () => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    setCocktail(data.drinks[0]);
    setShowDescription(false);
  };

  useEffect(() => {
    fetchRandomCocktail();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {cocktail ? (
        <div className="card w-96 bg-base-100 shadow-xl mb-6">
          <figure className="h-32 w-full overflow-hidden">
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} className="w-full h-full object-cover object-center" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{cocktail.strDrink}</h2>
            <button
              className="text-brand-500 hover:text-brand-600 transition-colors duration-200"
              onClick={() => setShowDescription(!showDescription)}
            >
              {showDescription ? 'Hide' : 'Show'} description
            </button>
            <br />
            <button
              className="bg-brand-500 text-white py-2 px-4 rounded-md mt-4"
              onClick={fetchRandomCocktail}
            >
              New Drink
            </button>
            {showDescription && (
              <>
                <h3 className="text-xl font-bold mb-2 mt-4">Ingredients</h3>
                <ul className="list-disc list-inside">
                  {[...Array(15)].map((_, i) => {
                    const ingredient = cocktail[`strIngredient${i + 1}`];
                    const measure = cocktail[`strMeasure${i + 1}`];
                    return ingredient ? (
                      <li key={i}>
                        {measure ? `${measure.trim()} of` : ''} {ingredient}
                      </li>
                    ) : null;
                  })}
                </ul>
                <h3 className="text-xl font-bold mt-4 mb-2">Instructions</h3>
                <p>{cocktail.strInstructions}</p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RandomCocktail;
