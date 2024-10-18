
// app.get('/chicken', (req, res)=>{
//     res.send("KFC Friend Chicken");
// });

// app.get('/idli', (req, res)=>{

//     var customised_idli = {
//         name: "Dwaipayan",
//         size: 10,
//         is_sambar: true,
//         is_chutney: true
//     }

//     res.send(customised_idli);

//     // res.send("South Indian IDLI");
// });


// app.post('/items', (req, res) =>{
//     res.send("Fetched");
// })


// app.post("/", (req, res) => {
//         let num1 =
//             Number(req.body.num1);
//         let num2 =
//             Number(req.body.num2);

//         let result = num1 + num2;
//         res.send("Addition - " + result);
//         console.log(req.body)
//         console.log(result)
//         // console.log(res)
//     });

//Callback Previous
// (error, savedPerson) =>{
//     if (error) {
//         console.log('Error on saving person',error);
//         res.status(500).json({error: "Internal server error"});
//     }else{
//         console.log('Data saved successfully');
//         res.status(201).json(savedPerson);
//     }
// }

const express = require('express');
const { size } = require('lodash');
const app = express();
const bodyParser = require('body-parser')
const PORT = 3000
const db = require('./config/db')


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// db.connect();

const Person = require('./models/Person');



app.get('/', (req, res)=>{
    res.send("Welcome to my hotel ! how can i help you? ");
});

app.post('/person', async(req, res) =>{

    try {
        
        const data = req.body;

        const newPerson = new Person(data);
        // newPerson.name = data.name;
    
       const response = await newPerson.save();
       res.status(201).json(response);
       console.log('Data Saved');

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }

});

app.get('/person', async(req, res)=>{

    try {
        
        const response = await Person.find();
        console.log('Data Fetched');
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({error:"Internal Server Error"});
    }

});




app.listen(PORT, ()=>{
    console.log(`Server Running in ${PORT}`)
});