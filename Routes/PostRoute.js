import express from 'express';
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getPost,
  getTimeLine,
  likePost,
  updatePost,
  fetchComment
} from '../Controllers/PostController.js';
const router = express.Router();

router.post('/', createPost);
router.get('/:id', getPost);
router.put('/:id', updatePost);
router.delete('/:id/:userId', deletePost);
router.put('/:id/like', likePost);
router.put('/comment/:id',addComment)
router.get('/:id/timeline', getTimeLine);
router.delete('/comment/:commentId/:postId',deleteComment)
router.get('/comment/:id',fetchComment)

export default router;
