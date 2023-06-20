// const mongoose = require('mongoose')
//const Group = require('../models/groupModel')
// group : Group.Schema

import mongoose from 'mongoose';

const projectSchema = mongoose.Schema(
    { 

          group: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Group',
          },
          
          name: {
            type: String,
            required: [true, 'Please add a text value'],
          },
    
          gitlink: {
            type: String,
          },
          text: {
            type: String,
            required: [true, 'Please add a text value'],
          },
          assignedto: {
            type: String,
            // required: [true, 'Please add a text value'],
          },
          deadline: {
            type: String,
            // required: [true, 'Please add a text value'],
          },
          status: {
            type: String,
            enum: ["done", "doing", "todo"],
            //required: [true, "Please add a value for status"],
          },
         
    }
);

// module.exports = mongoose.model('Project', projectSchema)
export default mongoose.model('Project', projectSchema);
