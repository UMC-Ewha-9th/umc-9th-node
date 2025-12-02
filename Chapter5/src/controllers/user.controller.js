// user.controller.js

import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, listMyReviews, listActiveMissions, processMissionCompletion } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
    try {
        console.log("회원가입을 요청했습니다!");
        console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용

        const user = await userSignUp(bodyToUser(req.body));
        
        // res.success 호출 (헬퍼 함수 사용)
        res.success({ 
            code: "201", 
            message: "회원가입 성공", 
            result: user 
        });
    } catch (error) {
        next(error);
    }
};

/**
 * '내가 작성한' 리뷰 목록 조회 핸들러
 * GET /api/v1/users/:userId/reviews
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
export const handleListMyReviews = async (req, res, next) => {
    try {
        // 1. Path Variable에서 userId 추출 및 BigInt 변환 (MySQL BigInt 대응)
        const userId = BigInt(req.params.userId); // BigInt 타입으로 변환

        // 2. Service 로직 호출
        const reviews = await listMyReviews(userId);

        // 3. 성공 응답 반환 (res.success 사용)
        // success: true는 헬퍼가 처리하므로 생략하고, data와 code, message만 전달합니다.
        res.success({
            code: "U200",
            message: "내가 작성한 리뷰 목록 조회 성공",
            data: {
                user_id: userId.toString(), // BigInt를 문자열로 변환하여 전송
                reviews: reviews,
            },
        });
    } catch (error) {
        // 에러를 전역 에러 핸들러로 전달
        next(error);
    }
};

/**
 * '내가 진행 중인' 미션 목록 조회 핸들러
 * GET /api/v1/users/:userId/missions
 */
export const handleListActiveMissions = async (req, res, next) => {
    try {
        // 1. Path Variable에서 userId 추출 및 BigInt 변환
        const userId = BigInt(req.params.userId); 

        // 2. Service 로직 호출
        const missions = await listActiveMissions(userId);

        // 3. 성공 응답 반환
        res.success({
            code: "M200",
            message: "진행 중인 미션 목록 조회 성공",
            data: {
                user_id: userId.toString(),
                missions: missions,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * 미션 진행 완료 처리 핸들러
 * PATCH /api/v1/missions/:attemptId/complete
 */
export const handleMissionCompletion = async (req, res, next) => {
    try {
        // Path Variable에서 attemptId를 가져와 BigInt 변환
        const attemptId = BigInt(req.params.attemptId); 
        // 🚨 임시: 실제로는 JWT 등으로 사용자 ID를 가져와야 합니다.
        const userId = BigInt(req.body.userId || 1); // 임시 사용자 ID 1 사용
        
        // Body에서 결제 금액 (spentAmount)을 가져옵니다.
        const spentAmount = req.body.spentAmount;

        if (!spentAmount || spentAmount <= 0) {
            // 에러 발생 시 next(err)로 던지면 전역 에러 핸들러(res.error)가 처리합니다.
            throw new Error("B400: 유효한 결제 금액(spentAmount)을 입력해야 합니다.");
        }

        // Service 로직 호출
        const result = await processMissionCompletion(userId, attemptId, spentAmount);

        // 3. 성공 응답 반환
        res.success({
            code: result.isSuccess ? "M200_C" : "M200_F",
            message: result.isSuccess ? "미션 성공 및 포인트 적립 완료" : "미션 실패 처리 완료",
            data: {
                attempt_id: result.attemptId.toString(),
                is_success: result.isSuccess,
                reward_point_earned: result.rewardPoint,
            },
        });
    } catch (error) {
        next(error);
    }
};