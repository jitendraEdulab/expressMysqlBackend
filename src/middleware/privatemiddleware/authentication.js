const jwt = require('jsonwebtoken');
const {userLoginSchema} = require("../../validations/uservalidation")
const {User} = require('../../models');
const bcrypt = require('bcrypt')
require('dotenv').config();

/**
 * @author: Jitendra jangid
 * @function: Will create token if login credetial is proper
 * @param: email and password
 */
const createToken = async(req,res,next) => {
    try{
        const validatedUser = await userLoginSchema.validateAsync(req.body,{abortEarly:false});
        const { email, password} = validatedUser;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
          return res.status(404).json({
            status: 404,
            message: 'User not found'
          });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
          return res.status(401).json({
            status: 401,
            message: 'Incorrect password'
          });
        }
        let payload = {
            "id":user.id,
            "username":user.username,
            "fullname":user.fullname,
            "email":user.email
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY,{expiresIn:'7d'});
        req.token = token
        return next();
    }catch(err){
        res.status(409).json({
            status:409,
            message:"Token is not created"
        });
    }
}

/**
 * @author: Jitendra jangid
 * @function: Will verify token
 */
const verifyToken = async(req,res,next) => {
    let token = req.headers['authorization'];  
    if(!token){
        res.status(401).json({status:401,message:'Unauthorized please provide token'});
    }
    try{
        token = token.split(' ')[1]
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = decode;
        return next();
    } catch(err){
        res.status(498).json({status:498,message:'Invalid token'});
    }
}

module.exports = {createToken,verifyToken}