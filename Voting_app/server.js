const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()
const connectDB = require('./config/db')

const PORT = process.env.PORT;
app.use(bodyParser.json());

connectDB();

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');



app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
});
