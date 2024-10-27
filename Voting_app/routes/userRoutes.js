const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAuthMiddleware, generateToken} = require('../jwt/jwt')

//Profile

router.get('/profile',jwtAuthMiddleware, async(req, res)=>{

    try {
        const userData = req.user;

        // console.log(userData);

        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({user});

    } catch (error) {
        res.status(500).json({error: 'Error fetching user data'});

    }

});


// Signup Route - Prevent duplicate emails
router.post('/signup', async(req, res) => {
    try {
        const data = req.body;
        const newUser = new User(data);
        const response = await newUser.save();


        const payload = {
            id: response.id,
            // username: response.username,
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
        
        const {aadharCardNumber, password} = req.body;

        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

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


// Fetch All Users
// router.get('/',jwtAuthMiddleware, async (req, res) => {
//     try {
//         const response = await User.find();
//         console.log('Data Fetched');
//         res.status(200).json(response);

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Fetch by Work Type
// router.get('/:workType', async (req, res) => {
//     try {
//         const workType = req.params.workType;
//         if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
//             const response = await User.find({ work: workType });
//             res.status(200).json(response);
//         } else {
//             res.status(400).json({ error: 'Invalid Work Type' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// Update User by ID
router.put('/profile/password', async (req, res) => {
    try {
        const userId = req.user.id;

        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

   
        if (!(await user.comparePassword(currentPassword))) {
            return res.status(404).json({ error: 'User Not Found' });
        }


        user.password = newPassword;
        await  user.save();


        console.log('Password Updated');

        res.status(200).json({message: 'Password Updated'});

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

// Delete User by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const UserId = req.params.id;
//         const response = await User.findByIdAndDelete(UserId);
//         if (!response) {
//             return res.status(404).json({ error: 'User Not Found' });
//         }
//         console.log('Data Deleted');
//         res.status(200).json({ message: 'User Deleted    Successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Invalid Deletion' });
//     }
// });

module.exports = router;