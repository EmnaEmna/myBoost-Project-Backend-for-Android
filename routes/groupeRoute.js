// const express = require('express')
// const router = express.Router()
import express from 'express';
const router = express.Router();

// Rest of your code...


// const {
//   creategroup,
//   updateEmail,
 
//   getGroups,
//   deleteGroup,
 
// } = require('../controllers/groupController')
import {
  creategroup,
  updateEmail,
 
  getGroups,
  deleteGroup,
  getUserGroupData,
 
} from '../controllers/groupController.js'

// const { protect } = require('../middleware/authMiddleware')
import { protect } from '../middleware/authMiddleware.js';

// Rest of your code...


router.post('/creategroup', protect,  creategroup)
router.get('/getgroups', protect,  getGroups)
router.patch('/updateEmail/:id', updateEmail)
//router.patch('/updateNameGroup/:id', updateNameGroup)
//router.patch('/updateGroup/:id', updateGroup)
router.delete('/deleteGroup/:id', deleteGroup)



router.get('/getGroupData', getUserGroupData); 





// module.exports = router
export default router;
