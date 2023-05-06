import React, { useState, useEffect } from 'react';
//import firebase from 'firebase/app';
//import 'firebase/database';

function Favorites() {
    const [cocktails, setCocktails] = useState([]);
    const [showDescription, setShowDescription] = useState(false);

    const fetchFavorites = async () => {
        const response = await fetch('http://localhost:5000/Favorites', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 401 || response.status === 500) {
            // Redirect to login page
            window.location.href = 'http://localhost:3000/discover';
        } else {
            // deal with null data
            const data = await response.json();
            console.log(data);
            setCocktails(data);
            setShowDescription(false);
          }
      };

      useEffect(() => {
        fetchFavorites();
      }, []);

      const addIngredient = async(ingredient) => {
        const response = await fetch('http://localhost:5000/ShoppingList/add', {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ingredient})
          });
          if (response.status === 201) {
            alert('ingredient is already in your shopping list!');
          } else {
            console.log(response);
          }
      };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center font-azeret-mono">
            {Object.entries(cocktails).length > 0 ? ( Object.entries(cocktails).map(([key, cocktail]) => (
                <div className="card w-96 bg-base-100 shadow-xl mb-6" key={key}>
                    <figure className="h-43 w-full overflow-hidden">
                        <img src={cocktail.strDrinkThumb} alt={cocktail.strDrink} className="w-full h-full object-cover object-center" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">{cocktail.strDrink}</h2>
                        <div className="flex justify-start">
                            <button
                                className="text-brand-500 hover:text-brand-600 transition-colors duration-200 mr-4"
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
                                            <><div style={{ display: 'flex', alignItems: 'center' }}>
                                                <li key={i}>
                                                    {measure ? `${measure.trim()} of` : ''} {ingredient}
                                                </li>
                                                <button key={i + "add"} onClick={() => addIngredient({ ingredient })}> (+)</button>
                                            </div></>
                                        ) : null;
                                    })}
                                </ul>
                                <h3 className="text-xl font-bold mt-4 mb-2">Instructions</h3>
                                <p>{cocktail.strInstructions}</p>
                            </>
                        )}
                    </div>
                </div>
            ))) : (
                <p>No favorites yet.</p>
            )}
        </div>
    );
}

export default Favorites;