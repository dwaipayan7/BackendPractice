const mongoose = require('mongoose')

const  connectDB = async () => {
  try {


    const mongoURL = 'mongodb+srv://biswastatay73:zRjQlTISkvIHdSe3@cluster0.7a0dj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/hotel';

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