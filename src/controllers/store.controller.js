// store.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { bodyToReview } from "../dtos/review.dto.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { storeRegister, registerReview, registerMission, challengeMission } from "../services/store.service.js";

export const handleStoreRegister = async (req, res, next) => {
  try {
    // 1. 요청 본문(req.body)에서 데이터를 가져와 DTO로 정리
    // DTO 함수를 사용해서 body 데이터를 정리하여 service에 전달
    const data = bodyToStore(req.body); // DTO 함수 사용

    // 2. Service 로직 호출
    const { storeId } = await storeRegister(data);

    // 3. 성공 응답 반환 (명세에 따른 201 Created)
    res.status(StatusCodes.CREATED).json({
      success: true,
      code: "S201",
      message: "가게가 성공적으로 등록되었습니다.",
      data: {
        store_id: storeId,
      },
    });
  } catch (error) {
    // 에러를 next()로 전달하여 Express의 전역 에러 핸들러로 보냄.
    // 현재는 전역 에러 핸들러가 없으므로 터미널에 에러가 출력됨.
    next(error);
  }
};

// 리뷰 등록 핸들러
export const handleReviewRegister = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId); // URL 파라미터에서 가게 ID 추출
        const userId = 1; // 🚨 임시: 실제로는 JWT 등으로 사용자 ID를 가져와야 합니다.
        
        // 1. DTO로 데이터 정리 및 조합 (req.body + req.params + userId)
        const reviewData = bodyToReview(req.body, storeId, userId);

        // 2. Service 로직 호출 (가게 존재 검증 포함)
        const { reviewId } = await registerReview(reviewData);

        // 3. 성공 응답 반환 (201 Created)
        res.status(StatusCodes.CREATED).json({
            success: true,
            code: "R201",
            message: "리뷰가 성공적으로 등록되었습니다.",
            data: {
                review_id: reviewId,
            },
        });
    } catch (error) {
        next(error);
    }
};

// 미션 등록 핸들러
export const handleMissionRegister = async (req, res, next) => {
    try {
        const storeId = parseInt(req.params.storeId); // URL 파라미터에서 가게 ID 추출
        
        // 1. DTO로 데이터 정리 및 조합
        const missionData = bodyToMission(req.body, storeId);

        // 2. Service 로직 호출 (가게 존재 검증 포함)
        const { missionId } = await registerMission(missionData);

        // 3. 성공 응답 반환 (201 Created)
        res.status(StatusCodes.CREATED).json({
            success: true,
            code: "M201",
            message: "미션이 성공적으로 등록되었습니다.",
            data: {
                mission_id: missionId,
            },
        });
    } catch (error) {
        next(error);
    }
};

// 미션 도전 핸들러 (POST /api/v1/missions/{missionId}/challenge)
export const handleMissionChallenge = async (req, res, next) => {
    try {
        // Path Variable에서 missionId를 가져와 숫자로 변환
        const missionId = parseInt(req.params.missionId); 
        // Query String에서 userId를 가져와 숫자로 변환 
        // (실제로는 Bearer 토큰으로 인증된 사용자 ID를 사용해야 함)
        const userId = parseInt(req.query.userId); 

        // 1. 필수 값 검증 (간단하게 확인)
        if (isNaN(missionId) || isNaN(userId)) {
            // Bad Request
            res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                code: "B400",
                message: "missionId 또는 userId 값이 유효하지 않습니다.",
            });
            return;
        }

        // 2. Service 로직 호출 (중복 검증 및 도전 기록 추가)
        const { attemptId } = await challengeMission(userId, missionId);

        // 3. 성공 응답 반환 (201 Created)
        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "미션 도전을 시작했습니다.",
            data: {
                attempt_id: attemptId,
            },
        });
    } catch (error) {
        // Service에서 발생시킨 에러 코드(M409 등)를 처리
        // 예를 들어, 'M409:'로 시작하면 409 Conflict로 처리하도록 전역 에러 핸들러 설정 필요
        // 현재는 next()로 전달하여 기본 에러 핸들러에 맡김
        next(error);
    }
};