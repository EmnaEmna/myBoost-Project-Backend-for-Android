// const mongoose = require('mongoose')
// const User = require('../models/userModel')
import mongoose from 'mongoose';
import User from '../models/userModel.js';

// Rest of your code...


const groupSchema = mongoose.Schema(
    {
        //user: User.schema,

        user: {
            type: mongoose.Schema.Types.ObjectId,
           
            ref: 'User',
            },
       
        name: 
        {
            type: String,
            required: true
        },
        year: {
            type: String,
           
        },
        classroom: 
        {
            type: String,
            
        },
        emails:{
            type :[String] ,
        },

    
    },
    
);



// module.exports = mongoose.model('Group', groupSchema)
export default mongoose.model('Group', groupSchema);
