// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assumes you have a User model
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Post', postSchema);
