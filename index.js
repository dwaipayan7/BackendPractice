const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.send('This is Dwaipayan');
});

app.listen(3000, ()=>{
    console.log("Running in Port 3000");
})