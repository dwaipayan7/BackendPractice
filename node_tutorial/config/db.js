const mongoose = require('mongoose')

const mongoURL = 'mongodb://localhost:27017/hotel';

mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log("Connected to MongoDB server");
});

module.exports = db;