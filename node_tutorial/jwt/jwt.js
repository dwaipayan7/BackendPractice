const { config } = require('dotenv');
const jwt = require('jsonwebtoken');
config()

const jwtAuthMiddleware = (req, res, next) =>{

    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'No token provided' });

    }

    const token = req.headers.authorization.split(' ')[1];
    
    if(!token){
        return res.status(401).json({message: 'No token provided.'});
    }

    try {
        //payload decoded
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
//Payload value
      req.user = decoded
      next();

    } catch (error) {
        console.log(error);
        res.status(401).json({message: 'Invalid token.'});

    }
}

//generate token

const generateToken = (userData) =>{
    return jwt.sign({user: userData}, process.env.JWT_SECRET, {expiresIn: '1h'});
}

module.exports = {jwtAuthMiddleware, generateToken};