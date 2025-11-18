// src/routes/users.route.js

import express from 'express';
import { handleUserSignUp } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/signup', handleUserSignUp);

export default router;