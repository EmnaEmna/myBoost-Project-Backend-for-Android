// const express = require('express')
// const router = express.Router()
import express from 'express';
const router = express.Router();


// const {
//   createproject,
//   getProjects,
//   getGroupEmails,
//   updateProject
 
// } = require('../controllers/projectController')

import {
  createproject,
  getProjects,
  getGroupEmails,
  updateProject
 
} from'../controllers/projectController.js'

router.post('/createproject' ,createproject)
router.post('/getProject',getProjects)

router.get('/getEmails',getGroupEmails)


router.put('/updateProject',updateProject)




export default router;
