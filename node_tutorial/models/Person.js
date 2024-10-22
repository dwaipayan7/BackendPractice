const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    age:{
        type:Number
    },
    work:{
        type: String,
        enum:['chef','waiter','manager'],
        required: true
    },
    mobile:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    address:{
        type: String
    },
    salary:{
        type: Number,
        required: true
    },
    username: {

        require: true,
        type: String
    },
    password: {
        require: true,
        type:String
    }
});

personSchema.pre('save', async function(next) {
    const person = this;

    if (!person.isModified('password')) {
        return next();
    }

    try {
        //hash password generation
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //override the plain password with the hashed password

        person.password = hashedPassword;

        
        next();
    } catch (error) {
        return next(error);
    }
});

personSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}


//Create Model

const Person = mongoose.model('Person',personSchema);
module.exports = Person;