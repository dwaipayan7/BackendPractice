const { name } = require('ejs');
const express = require('express');
const { size } = require('lodash');
const app = express();
const bodyParser = require('body-parser')
const PORT = 3000


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res)=>{
    res.send("Welcome to my hotel ! how can i help you? ");
});

app.get('/chicken', (req, res)=>{
    res.send("KFC Friend Chicken");
});

app.get('/idli', (req, res)=>{

    var customised_idli = {
        name: "Dwaipayan",
        size: 10,
        is_sambar: true,
        is_chutney: true
    }

    res.send(customised_idli);

    // res.send("South Indian IDLI");
});


app.post('/items', (req, res) =>{
    res.send("Fetched");
})


app.post("/", (req, res) => {
        let num1 =
            Number(req.body.num1);
        let num2 =
            Number(req.body.num2);

        let result = num1 + num2;
        res.send("Addition - " + result);
        console.log(req.body)
        console.log(result)
        // console.log(res)
    });

app.listen(PORT, ()=>{
    console.log(`Server Running in ${PORT}`)
});