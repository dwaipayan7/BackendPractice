
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
const connectDB = require('./config/db')
const Person = require('./models/Person')


require('dotenv').config();
// config()

const PORT = process.env.PORT || 4000;
// db.connect();
connectDB();


app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;


app.use(new LocalStrategy(async(USERNAME, password, done) =>{

    try {
        console.log('Received Credential: ',USERNAME, password);

        const user = Person.findOne({username: USERNAME});

        if (!user) {
            return done(null, false, {message: 'Incorrect username!'});
        }
        const isPasswordMatch = user.password == password ? true : false;

        if (isPasswordMatch) {
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password!'});
        }
       


    } catch (error) {
        return done(error);
    }

}));


const MenuItem = require('./models/MenuItems');

//Middleware Function

const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} - Request Made to: ${req.url}`);
    next();
}


app.use(logRequest) // Access by every area Middleware


app.get('/',logRequest ,(req, res)=>{
    res.send("Welcome to our hotel");
});


const personRoutes = require('./router/personRouter');
const menuRoutes = require('./router/menuRoutes');
const { config } = require('dotenv');


app.use('/person',personRoutes);
app.use('/menu',menuRoutes)


app.listen(PORT, ()=>{
    console.log(`Server Running in ${PORT}`)
});