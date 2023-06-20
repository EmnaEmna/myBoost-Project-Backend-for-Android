// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const User = require('../models/userModel')
// const nodemailer = require('nodemailer')

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import nodemailer from 'nodemailer';


const JWT_SECRET='some super secret...';

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: '******************',
	  pass: '****************'
	}
  });


//generate a random code with 8 numbers (works)
function generateCode() 
{
	var length = 8,
		charset = "0123456789",
		retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

// reset password 
export async function resetPassword (req, res) {
	const { email, password,} = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		res.status(400).json({ error: "User don't exists" });
	} else {
		const token = generateCode();
		process.env.code=token;
		user.token = token;
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		res.status(200).json({ message: "password changed" })
			};
			};

      export function forgot_password(req,res,next){
  
  User.findOne({ "email": req.body.email }).then(user=>{
    if(!user) {
      console.log('No account with that email address exists.')
    }else{
      const secret = JWT_SECRET + user.password;
      const payload = {username: user.username,email:user.email};
      const token = jwt.sign(payload,secret,{expiresIn: '5m'});
      console.log('req.headers.host'+ 'verification lien de host ');
      const link = `https://${req.headers.host}/api/userp/reset_password/${user.email}/${token}`
      console.log(link);
      res.status(200).json({msg:`password send to your email Mr./Mrs ${user.username}`});

      var mailOptions = {
        from: '*************',
        to: req.body.email,
        subject: 'Password Reset Email ' ,
        text: `click the link to reset password ${link}`  ,
      }
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        });
      

    }
  });
}
///reset_password_get/:email/:token
export function reset_password_get(req,res,next){
  User.findOne({ "email": req.params.email }).then(user=>{
    if(!user) {
      res.send('No account with that email address exists.')
    }else {
      const secret = JWT_SECRET + user.password;
      try{
        const payload = jwt.verify(req.params.token, secret)
        res.render('reset-password',{email: user.email})
      } catch(error){
        console.log(error.message)
        res.send(error.message)
      }
    }
  });
}
export async function reset_password_post(req,res){
  const {password,password2} = req.body
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt)
  User.findOne({ "email": req.params.email }).then(user=>{
    if(!user) {
      res.send('No account with that email address exists.')
    }else {
      const secret = JWT_SECRET + user.password;
      if(password === password2){
      try{

        const payload = jwt.verify(req.params.token, secret);
        user.password = hashedPassword;
        user.save();
        res.send("password reset successfully")
        
      } catch(error){
        console.log(error.message)
        res.send(error.message)
      }
    }else{res.send("password mismatch")}
    }
  });
}



//MODIFY PROFILE

export async function editUser  (req, res) {
	const {email, name,} = req.body;
	const user = await User.findOne({ email });

       if (name === ''){ 
        res.json("username is empty")
        return "user is empty"
    }

    if ( name!= ''){ 
		if(user.email == email){
			user.name = name; 
			user.save();
		}
		else {
			res.json("email don't match")
		}
       
    }
    console.log("profile updated")
    return res.json({user})
};
//************************************************************************* */
//------------------------------------------------------------------
//--------------------------- use PROFILE MODEL for the picture and to get email nam picture of user
//------------------------------ to add and edit profile image too -------------------------------------


// const Profile = require('../models/profileModel');

import Profile from '../models/profileModel.js'

export function addProfilePic(req, res) {
  console.log('I m in ADDDDDDD PROGILE PICTURE ----------------------------  get pic IN ')

  const email = req.query.email; 
  User.findOneAndUpdate(
    email,
    { userPic: `${req.protocol}://${req.get('host')}/img/${req.file.filename}` },
    { new: true }
  )
    .then((updatedUser) => {
      res.status(200).json({
        profilePic: updatedUser.userPic,
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}


export function getUserProfile(req, res) {
  const email = req.query.email;
console.log('I m in get PROGILE PICTURE ----------------------------  get pic IN ')
  User.findOne({ email: email })
    .select('email name userPic') // Specify the fields to include in the response
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        _id: user._id,
        email: user.email,
        name: user.name,
        userPic: user.userPic, // Include the userPic field in the response
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}


// module.exports = {

//   editUser,resetPassword,forgot_password,reset_password_get,reset_password_post,addProfilePic

// }
export default {
  editUser,resetPassword,forgot_password,reset_password_get,reset_password_post,addProfilePic
};