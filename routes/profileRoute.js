// const express = require('express')
// const router = express.Router()
// const multer = require("../middleware/multer-config");
import express from 'express';
import multer from "../middleware/multer-config.js";

const router = express.Router();




import {
  resetPassword,
  editUser,forgot_password,reset_password_get,reset_password_post,addProfilePic,getUserProfile
} 

 from '../controllers/profilecontroller.js'

//const { protect } = require('../middleware/authMiddleware')



router.post('/editus', editUser)

router.post('/resetPwd', resetPassword)

router
.route('/forgot_password')
.post(forgot_password);

router
.route('/reset_password/:email/:token')
.get(reset_password_get);

router
.route('/reset_password/:email/:token')
.post(reset_password_post);


// router.post('/addProfilePic', multer("profilePic", 512 * 1024), addProfilePic);

router.put('/profilepic',multer("profilePic", 512 * 1024), addProfilePic);
router.get('/profile', getUserProfile);


// module.exports = router
export default router;
