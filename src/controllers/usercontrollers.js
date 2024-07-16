const {User,Profile} = require('../models');
const {userRegisterSchema} = require('../validations/uservalidation');
const logger = require('../middleware/publicmiddleware/winston');
const profile = require('../models/profile');

/**
 * @author: Jitendra jangid
 * @function: Register new users
 * @param: username,fullname,password,email
 */
const registerUser = async(req,res) => {
    try{      
      const validatedUser = await userRegisterSchema.validateAsync(req.body, { abortEarly: false });
      const {username, password,fullname, email } = validatedUser
      const data = await User.create({
          username: username,
          password: password,
          fullname: fullname,
          email : email,
          profile : profile
        }) 

      res.status(201).json({
        status:201,
        message: "Data is created successfully",
        data: data
      })
      
    }catch(err){
      logger.error("errors==>>", err.message);
      res.status(409).json({
        status: 409,
        message: err.message
      })
    }

}

/**
 * @author: Jitendra jangid
 * @function: Login user
 * @param: email and password
 */
const loginUser = async (req, res) => {
    try{    
      res.status(200).json({
        status:200,
        message: "Logined Successful",
        token : req.token
      })

    }catch(err){
      res.status(400).json({ status:400,error: err.message });
    }
  };

/**
 * @author: Jitendra jangid
 * @function: Finding all existing users
 */
const getAllUsers = async (req,res) => {
  try{
    const users = await User.findAll({
      order:[['fullname', 'ASC']],
      attributes: ['username','fullname','email'],
    });
    logger.info('users->', users);
    if(users){
      res.status(200).json({
        status:200,
        message: "Users found",
        logined : req.user,
        data: users
      })
    }
  }catch(err){
    res.status(400).json({ status:400,error: err.message });
  }
}

/**
 * @author: Jitendra jangid
 * @function: Update login user details
 */
const detailsUpdate = async (req,res) => {
  try{
    const data  = await User.findOne({
      where:{
        id:req.user.id
      }
    })

    data['username'] = req.body.username;
    data['email'] = req.body.email;
    data['password'] = req.body.password;

    await data.save();    

    res.status(200).json({status:200, message: 'Data updated' })

  }catch(err){
    console.error("error", err);
    res.status(400).json({ status:400,error: err.message });
  }
}

/**
 * @author: Jitendra jangid
 * @function: Create new profile of login user
 */
const profileCreate = async (req,res) => {
  try{
    const profile = await Profile.create({
      userId : Number(req.user.id),
      profile : req.file.filename,
      summary : req.body.summary
    })
    res.status(200).json({status:200,message:"Profile created successfully",data:profile})
  }catch(err){
    logger.error(err);
    res.status(400).json({ status:400,error: err.message });
  }
}

/**
 * @author: Jitendra jangid
 * @function: Delete account
 */
const deleteAccount = async (req,res) => {
  try{
    logger.info("check",req.user);
    const user = await User.findOne({
      where:{
        id:req.user.id
      }
    })
    await user.destroy();
    res.status(200).json({status:200,message:'Account deleted'});
  }catch(err){
    logger.error(err)
    res.status(400).json({status:400,error: err.message});
  }
}


module.exports = { loginUser, registerUser, getAllUsers, detailsUpdate, profileCreate, deleteAccount };