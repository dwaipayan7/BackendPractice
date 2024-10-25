const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const connectDB = require('./config/db')

const PORT = process.env.PORT;
app.use(bodyParser.json());

connectDB();

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
});
