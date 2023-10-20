import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar:{
    type: String,
    default: 'https://media.istockphoto.com/id/1298261537/vector/blank-man-profile-head-icon-placeholder.jpg?s=2048x2048&w=is&k=20&c=arvyysiz2VuiQBB2DRZY0eXRu3169OlNJiSlqhupWF0='
  },
}, { timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
