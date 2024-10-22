
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
const app = express();
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();  // Ensure .env variables are loaded
const passport = require('./auth/auth')


// Connect to the database
const PORT = process.env.PORT || 4000;
connectDB();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware function to log requests
const logRequest = (req, res, next) => {
    console.log(`${new Date().toLocaleString()} - Request made to: ${req.url}`);
    next();
};

// Initialize Passport
app.use(passport.initialize());
app.use(logRequest); // Access by every area Middleware

// Authentication middleware using Passport
const localAuthMiddleware = passport.authenticate('local', { session: false });

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to our hotel");
});

const personRoutes = require('./router/personRouter');
const menuRoutes = require('./router/menuRoutes');

app.use('/person', personRoutes);
app.use('/menu', menuRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
