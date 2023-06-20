// const express = require('express')
// const router = express.Router()
import express from 'express';
const router = express.Router();

// const {
//   registerUser,
//   loginUser,

// } = require('../controllers/userController')

import {
  registerUser,
  loginUser,resetPassword,forgotPassword,

} from '../controllers/userController.js'

//const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router
.post('/resetpassword',resetPassword)

router
.post('/forgotpassword',forgotPassword)


export default router;
