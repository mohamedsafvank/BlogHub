// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const { createPost ,getAllPosts,getPostsByAuthor,updatePost,deletePost} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/blogs', authMiddleware, upload.single('image'), createPost);
router.put('/blogs/:id', authMiddleware, upload.single('image'), updatePost);
router.delete('/blogs/:id', authMiddleware, deletePost);
router.get('/blogs', getAllPosts);
router.get('/blogs/:id', getPostsByAuthor);

module.exports = router;
