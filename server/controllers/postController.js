// controllers/postController.js

const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');


const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file?.filename;

    if (!title || !content || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newPost = new Post({
      title,
      content,
      image: `/uploads/${image}`,
      author: req.user.id, // user ID from token
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};



const getAllPosts = async (req, res) => {
    
  try {
    const posts = await Post.find().sort({ date: -1 }); // newest first
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error });
  }
};



const getPostsByAuthor = async (req, res) => {
  try {
    const authorId = req.params.id;

    const posts = await Post.find({ author: authorId }).populate('author', 'name email'); // populate if needed

    if (!posts.length) {
      return res.status(404).json({ message: 'No posts found for this user.' });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching posts', error });
  }
};


// UPDATE POST
const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;
    const image = req.file?.filename;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure user can only update their own posts
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete old image if a new one is uploaded
    if (image && post.image) {
      const oldImagePath = path.join(__dirname, '..', 'public', post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      post.image = `/uploads/${image}`;
    }

    post.title = title || post.title;
    post.content = content || post.content;

    await post.save();
    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (error) {
    console.error('Post update error:', error);
    res.status(500).json({ message: 'Failed to update post', error });
  }
};


// DELETE POST
const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure only the post author can delete it
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Delete image file if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', 'public', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Post delete error:', error);
    res.status(500).json({ message: 'Failed to delete post', error });
  }
};




module.exports = { createPost, getAllPosts , getPostsByAuthor,updatePost,deletePost};
