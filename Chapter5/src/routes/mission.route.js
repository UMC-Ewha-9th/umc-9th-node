// src/routes/mission.route.js

import express from 'express';
// store.controller.js에서 미션 도전 핸들러 임포트
import { handleMissionChallenge } from '../controllers/store.controller.js'; 
import { handleMissionCompletion } from '../controllers/user.controller.js';

const router = express.Router();

// 미션 도전 API (POST /api/v1/missions/{missionId}/challenge)
// Path Variable missionId와 Query String userId를 사용
router.post('/:missionId/challenge', handleMissionChallenge);

// 미션 완료 처리 API (PATCH /api/v1/missions/{attemptId}/complete)
router.patch('/:attemptId/complete', handleMissionCompletion); // PATCH 또는 PUT 사용 권장

export default router;