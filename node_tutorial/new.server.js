
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
const connectDB = require('./config/db')


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// db.connect();
connectDB();

const MenuItem = require('./models/MenuItems');



app.get('/', (req, res)=>{
    res.send("Welcome to my hotel ! how can i help you? ");
});


const personRoutes = require('./router/personRouter');
app.use('/person',personRoutes);

const menuRoutes = require('./router/menuRoutes')
app.use('/menu',menuRoutes)


app.listen(PORT, ()=>{
    console.log(`Server Running in ${PORT}`)
});