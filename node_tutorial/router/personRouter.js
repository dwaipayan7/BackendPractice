const express = require('express');
const router = express.Router();
const Person = require('../models/Person');

// Signup Route - Prevent duplicate emails
router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newPerson = new Person(data);
        const response = await newPerson.save();
        res.status(200).json(response);
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

// Fetch All Persons
router.get('/', async (req, res) => {
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
