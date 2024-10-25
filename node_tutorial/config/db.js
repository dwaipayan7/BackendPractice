const { config } = require('dotenv');
const mongoose = require('mongoose');
config()

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL;
    await mongoose.connect(mongoURL);
    console.log("Connected to MongoDB server");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
}




module.exports = connectDB;