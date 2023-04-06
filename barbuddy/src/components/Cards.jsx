import React from "react";
import cocktailImage from './cocktail.png';

function Cards() {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure>
        <img src={cocktailImage} alt="cocktail" width="200" height="200" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Cocktail Name</h2>
        <p>Cocktail description</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">More</button>
        </div>
      </div>
    </div>
  );
}

export default Cards;
