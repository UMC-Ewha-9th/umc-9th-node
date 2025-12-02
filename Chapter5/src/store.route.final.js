// store.route.final.js

import express from 'express';
import { handleStoreRegister, handleReviewRegister, handleMissionRegister, handleListStoreMissions } from './controllers/store.controller.js';

const router = express.Router();

// 1-1. 특정 지역에 가게 추가 API (POST /api/v1/stores)
router.post('/', handleStoreRegister); 
// index.js에서 /api/v1/stores로 연결할 것이므로, 여기는 '/'만 정의

// 1-2. 가게 리뷰 추가 API (POST /api/v1/stores/:storeId/reviews)
router.post('/:storeId/reviews', handleReviewRegister);

// 1-3. 가게 미션 추가 API (POST /api/v1/stores/:storeId/missions)
router.post('/:storeId/missions', handleMissionRegister);

// 1-4. 가게 미션 목록 조회 API (GET /api/v1/stores/:storeId/missions)
router.get('/:storeId/missions', handleListStoreMissions);

export default router;