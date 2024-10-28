const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('../jwt/jwt')


const checkAdminRole = async(userID) =>{
    try {
        const user = await User.findById(userID);
        return user.role === 'admin';
    } catch (error) {
        return false;
    }
}

router.post('/', async(req, res) => {
    try {
        const data = req.body;
        const newCandidate = new Candidate(data);
        const response = await newCandidate.save();


        const payload = {
            id: response.id,
            // Candidatename: response.Candidatename,
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

//Profile
router.get('/profile',jwtAuthMiddleware, async(req, res)=>{

    try {
        const CandidateData = req.Candidate;

        // console.log(CandidateData);

        const CandidateId = CandidateData.id;
        const Candidate = await Candidate.findById(CandidateId);

        res.status(200).json({Candidate});

    } catch (error) {
        res.status(500).json({error: 'Error fetching Candidate data'});

    }

});




// Update Candidate by ID
router.put('/profile/password', async (req, res) => {
    try {
        const CandidateId = req.Candidate.id;

        const { currentPassword, newPassword } = req.body;

        const Candidate = await Candidate.findById(CandidateId);

   
        if (!(await Candidate.comparePassword(currentPassword))) {
            return res.status(404).json({ error: 'Candidate Not Found' });
        }


        Candidate.password = newPassword;
        await  Candidate.save();


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

// Delete Candidate by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const CandidateId = req.params.id;
//         const response = await Candidate.findByIdAndDelete(CandidateId);
//         if (!response) {
//             return res.status(404).json({ error: 'Candidate Not Found' });
//         }
//         console.log('Data Deleted');
//         res.status(200).json({ message: 'Candidate Deleted    Successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Invalid Deletion' });
//     }
// });

module.exports = router;