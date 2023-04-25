const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000; // can always change

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000' //replace with your frontend domain
  }));
app.use(express.urlencoded({extended:true}));

app.get("/random", async (req, res) => {
    console.log("get req received!");
    try {
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/random.php');
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data from API');
    }
});

app.post("/Favorites", cors(),async(req,res)=>{

})

app.post("/api/search", async(req,res)=>{
    console.log("post req received from search!");
    const searchTerm = req.body.term;
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchTerm;
    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const filteredResults = data.drinks || [];
        res.json(filteredResults);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching search results from API');
    }
})

app.get("/filter", async(req,res)=>{
  const filter = req.query.filter || '';
  try {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${filter}`);
    const data = response.data;
    // Return the filtered cocktails to the client
    const filteredResults = data.drinks || [];
    res.json(filteredResults);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

app.listen(PORT, () => {
    console.log('server running on port: ' + PORT);
});