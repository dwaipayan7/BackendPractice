const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user')
const {jwtAuthMiddleware, generateToken} = require('../jwt/jwt')


const checkAdminRole = async(userID) =>{
    try {
        const user = await User.findById(userID);
        return user.role === 'admin';
    } catch (error) {
        return false;
    }
}

router.post('/',jwtAuthMiddleware, async(req, res) => {
    try {
        if (!await checkAdminRole(req.user.id)) {
            return  res.status(403).json({message: 'Only admins can create candidates'});

        }


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



// Update Candidate by ID
router.put('/:candidateID',jwtAuthMiddleware, async (req, res) => {

    try {
        if (!await checkAdminRole(req.user.id)) {
            return  res.status(403).json({message: 'Only admins can create candidates'});

        }

        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData,  { new: true, runValidators: true });

        if (!response) {
            return  res.status(404).json({ message: 'Candidate not found' });

        }
        console.log("Candidate Data Updated")

    } catch (error) {
      
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        
    }
});

// Delete Candidate by ID
router.delete('/:candidateID',jwtAuthMiddleware, async (req, res) => {
    try {

        if (!await checkAdminRole(req.user.id)) {
            return  res.status(403).json({message: 'Only admins can create candidates'});

        }


        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID);
        if (!response) {
            return res.status(404).json({ error: 'Candidate Not Found' });
        }
        console.log('Data Deleted');
        res.status(200).json({ message: 'Candidate Deleted    Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Invalid Deletion' });
    }
});

router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userID = req.user.id;

    try {
        // Find candidate by ID
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate Not Found' });
        }

        // Check if user has already voted (assuming Candidate has a `votes` field that tracks user votes)

        const user = await User.findById(userID);
        if (!user) {
             return res.status(404).json({ message: 'User Not Found' });
        }

    if(user.role == 'admin'){
        return res.status(403).json({message: 'Admin cannot vote'});
    }

    candidate.votes.push({user: userID});
    candidate.voteCount++;
    await candidate.save()

    user.isVoted = true;
    await user.save()

        return res.status(200).json({ message: 'Vote successfully recorded' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while processing the vote' });
    }
});

router.get('/vote/count', async(req, res)=>{
    try {
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord = candidate.map((data) =>{
            return{
                party: data.party,
                count: data.voteCount
            }
        });

         return res.status(200).json(voteRecord);

        
    } catch (error) {
        res.status(500).json({ error: 'Invalid Vote Count' });

    }
})

module.exports = router;