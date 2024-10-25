const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const {jwtAuthMiddleware, generateToken} = require('../jwt/jwt')


// Signup Route - Prevent duplicate emails
router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();


        const payload = {
            id: response.id,
            username: response.username,
        }

        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        console.log("Token is:  " + token);
        //display the response token -->
        res.status(200).json({response:response, token: token});

        console.log('Data Saved');
    } catch (error) {
        if (error.code === 11000) {
            // This error code indicates a duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({ error: `${field} already exists` });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

//Login

router.post('/login', async(req, res) =>{
    try {
        
        const {username, password} = req.body;

        const user = await Person.findOne({username:username});

        if (!user || !(await user.comparePassword(password))) {
            return  res.status(401).json({error: 'Invalid username or password'});
        }

        //generate token
        const payload = {
            id: user.id,
            username: user.username,
        }
        const token = generateToken(payload);

        res.status(200).json({token: token});


    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});

    }
});


// Fetch All Persons
router.get('/',jwtAuthMiddleware, async (req, res) => {
    try {
        const response = await Person.find();
        console.log('Data Fetched');
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fetch by Work Type
router.get('/:workType', async (req, res) => {
    try {
        const workType = req.params.workType;
        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await Person.find({ work: workType });
            res.status(200).json(response);
        } else {
            res.status(400).json({ error: 'Invalid Work Type' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update Person by ID
router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const updatedPersonData = req.body;
        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true
        });
        if (!response) {
            return res.status(404).json({ error: 'Person Not Found' });
        }
        console.log('Data Updated');
        res.status(200).json(response);
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            res.status(400).json({ error: `${field} already exists` });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Delete Person by ID
router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);

        if (!response) {
            return res.status(404).json({ error: 'Person Not Found' });
        }

        console.log('Data Deleted');
        res.status(200).json({ message: 'Person Deleted Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Deletion' });
    }
});

module.exports = router;
