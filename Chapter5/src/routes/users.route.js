// src/routes/users.route.js

import express from 'express';
import { handleUserSignUp, handleListMyReviews, handleListActiveMissions } from '../controllers/user.controller.js';

const router = express.Router();

// 1. 회원가입 API
router.post('/signup', handleUserSignUp);

// 2. 내가 작성한 리뷰 목록 조회 API (GET /api/v1/users/:userId/reviews)
// 실제로는 인증 정보를 통해 userId를 가져오지만, 여기서는 Path Variable을 사용합니다.
router.get('/:userId/reviews', handleListMyReviews);

// 3. 내가 진행 중인 미션 목록 조회 API
router.get('/:userId/missions', handleListActiveMissions);

export default router;