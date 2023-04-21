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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center font-azeret-mono">
      {cocktail ? (
        <div className="card w-96 bg-base-100 shadow-xl mb-6">
          <figure className="h-43 w-full overflow-hidden">
            <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} className="w-full h-full object-cover object-center" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{cocktail.strDrink}</h2>
            <div className="flex justify-start">
              <button
                className="text-brand-500 hover:text-brand-600 transition-colors duration-200 mr-4 underline"
                onClick={() => setShowDescription(!showDescription)}
              >
                {showDescription ? 'Hide' : ' Show'} description
              </button>
            </div>
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
      <button
        className="text-background bg-highlights border-2 border-highlights bg-brand-500 py-2 px-4 rounded-md mt-4"
        onClick={fetchRandomCocktail}
      >
        New Drink
      </button>
    </div>
  );
};

export default RandomCocktail;
