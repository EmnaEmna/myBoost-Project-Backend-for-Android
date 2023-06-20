// const express = require('express');
import express from 'express'
//const { errorHandler } = require('./middleware/errorMiddleware');

//const connectDB = require('./config/db');
//import { connectDB } from './config/db';
import mongoose from 'mongoose';

import userRoutes from './routes/userRoutes.js'
import groupeRoutes from './routes/groupeRoute.js'
import projectRoutes from './routes/projectRoutes.js'
import profiletRoutes from './routes/profileRoute.js'
import calendartRoutes from './routes/calendarRoute.js'



const app = express();
const port = process.env.PORT || 9090;

//connectDB();

const databaseName = 'appProjectGroup';

mongoose.set('strictQuery', false)
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
 // .connect(`mongodb://mongo:S9uwkMKj8KUI9V4rCATo@containers-us-west-27.railway.app:6238`)
  .connect(`mongodb://0.0.0.0:27017/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine','ejs')
app.use('/img', express.static('public/images'));

app.use('/api/users',userRoutes);
app.use('/api/userp', profiletRoutes);

app.use('/api/group', groupeRoutes);
app.use('/api/project', projectRoutes);


app.use('/google', calendartRoutes);



app.listen(port, () => console.log(`Server started on port ${port}`));