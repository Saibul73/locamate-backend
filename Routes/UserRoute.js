import express from 'express';
import {
  deleteUser,
  followUser,
  getAllUser,
  getUser,
  UnfollowUser,
  updateUser
} from '../Controllers/UserController.js';

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.put('/:id/follow', followUser);
router.put('/:id/unfollow', UnfollowUser);
router.get('/', getAllUser);

export default router;
