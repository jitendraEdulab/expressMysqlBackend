const express = require('express');
const router = express.Router();
const usercontroller = require('../controllers/usercontrollers');
const profileUpload = require('../middleware/fileupload');
const {createToken, verifyToken} = require('../middleware/authentication');

router.post('/register',usercontroller.registerUser);

router.post('/login',createToken,usercontroller.loginUser);

router.use(verifyToken);

router.get('/get-all-users', usercontroller.getAllUsers);

router.put('/details-upate', usercontroller.detailsUpdate);

router.post('/profile-upload', profileUpload , usercontroller.profileCreate);

router.delete('/delete-account', usercontroller.deleteAccount);

module.exports = router;