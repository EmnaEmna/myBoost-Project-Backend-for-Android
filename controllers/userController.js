// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
// const asyncHandler = require('express-async-handler')
// const User = require('../models/userModel')
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

import PasswordResetCode from '../models/PasswordResetCode.js';

// Rest of your code...


// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,role} = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role:user.role,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    })
    console.log("here " + generateToken)
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})




import crypto from 'crypto';
import nodemailer from 'nodemailer';




// Route pour envoyer l'email de réinitialisation de mot de passe
export const forgotPassword =  async (req, res) => {
  const { email } = req.body;

  // Vérifier si l'utilisateur existe dans la base de données
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  // Générer un code de vérification aléatoire
  const verificationCode = crypto.randomBytes(3).toString('hex');

  // Enregistrer le code de vérification dans la base de données pour cet utilisateur
  const passwordResetCode = new PasswordResetCode({
    userId: user._id,
    resetCode: verificationCode,
  });
  
  await passwordResetCode.save();

  // Envoyer l'email de réinitialisation de mot de passe
  let transporter = nodemailer.createTransport({
    host: '******',
    port: 465,
    secure: true,
    auth: {
      user: '**************', // replace with your email address
      pass: '******************' // replace with your email password
    }
  });

  const mailOptions = {
    from: '"Hr-Manager" <hrmangerp@gmail.com>', // sender address
    to: email,
    subject: 'Password reset',
    text: `Your verification code is : ${verificationCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Une erreur est survenue lors de l\'envoi de l\'email' });
    }
    res.status(200).json({ message: 'A password reset email has been sent.' });
  });
};

// Route pour réinitialiser le mot de passe
export const resetPassword =  async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  // Vérifier si l'utilisateur existe dans la base de données
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'Utilisateur non trouvé' });
  }

  const passwordResetCode = await PasswordResetCode.findOne({
    userId: user._id,
    resetCode: verificationCode,
  });
  
  if (!passwordResetCode) {
    return res.status(400).json({ message: 'Code de vérification incorrect' });
  }

  // Générer un nouveau hash de mot de passe
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Mettre à jour le mot de passe dans la base de données
  user.password = hashedPassword;
  user.resetPasswordCode = undefined;
  await user.save();

  res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, 'hey123hgert', {
    expiresIn: '30d',
  })
}


// module.exports = {
//   registerUser,
//   loginUser,
  
  


// }


export default {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};