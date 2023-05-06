import React, { useState, useEffect } from "react";

function ShoppingList () {
    const [ingredients, setIngredients] = useState([]);

    const fetchShoppingList = async () => {
        const response = await fetch('http://localhost:5000/ShoppingList/get', {
            credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
        })
        if (response.status === 401 || response.status === 500) {
            console.log('oops');
        } else {
            const data = await response.json();
            setIngredients(Object.entries(data).map(([key, value]) => ({ key, value })));
          }
    };

    useEffect(() => {
        fetchShoppingList();
    }, []);

    return(
        <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "bold", textDecoration: "underline" }}>Shopping List</h1>
                <ul style={{ padding: "0", margin: "0", listStyleType: "none" }}>
                    {ingredients.map((ingredient, index) => (
                        <li key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "10px" }}>
                            <img src={ingredient.value} alt={ingredient.key} style={{ maxWidth: "100%", height: "auto" }} />
                            <p style={{ fontSize: "16px", fontWeight: "bold" }}>{ingredient.key}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default ShoppingList;
