const express = require('express');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; // can always change

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/Search",cors(),async(req,res)=>{
    const {msg}=req.body
    const item={msg:msg}
    const url = "www.thecocktaildb.com/api/json/v1/1/search.php?s=" + item
    await axios.get(url)
        .then((response)=>{
            console.log(response.drinks);
            res.json(response.drinks);
        })
})

app.post("/Search",async(req,res)=>{
    
})

app.listen(port, () => {
    console.log('server running on port: ${port}');
});