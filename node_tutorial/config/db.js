const { config } = require('dotenv');
const mongoose = require('mongoose');
config()

const  connectDB = async () => {
  try {


    const mongoURL = process.env.MONGO_URL;

    // mongodb://localhost:27017/hotel

    mongoose.connect(mongoURL);
    
    const db = mongoose.connection;
    
    db.on('connected', ()=>{
        console.log("Connected to MongoDB server");
    });
  } catch (error) {
    console.log("Error Server");
  }
}




module.exports = connectDB;