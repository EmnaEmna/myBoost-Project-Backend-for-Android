// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  profilePic: {
    type: String,
  },
 
});

// const Profile = mongoose.model('Profile', profileSchema);

// module.exports = Profile;
export default mongoose.model('Profile', profileSchema);
