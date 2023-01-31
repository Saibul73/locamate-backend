import express from 'express';
import { loginUser, registerUser, updatePassword } from '../Controllers/AuthController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/update/:id',updatePassword)

export default router;
