const express = require('express');
const app = express()
const path = require("path")

app.set("view engine","ejs");
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"public")));

app.get('/', (req, res) =>{
    res.send("Welcome");
    console.log("Done");
});


app.listen(3000, () =>{
   console.log("Running in 3000"); 
});