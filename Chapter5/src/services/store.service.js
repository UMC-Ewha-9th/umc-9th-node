import { addStore, getStoreById, addReview, addMission } from "../repositories_new/store.repository.js";
import { checkMissionChallenge, insertMissionAttempt } from "../repositories_new/mission.repository.js";

// 가게 등록 비즈니스 로직
export const storeRegister = async (data) => {
// ... (기존 로직 유지)
    const storeId = await addStore(data);

    if (!storeId) {
        throw new Error("가게 등록에 실패했습니다.");
    }

    return { storeId };
};

export const registerReview = async (data) => {
    const { storeId, userId, rating } = data;

    // 1. [핵심 검증] 가게 존재 여부 확인
    const store = await getStoreById(storeId);
    if (!store) {
        throw new Error("S404: 해당 가게를 찾을 수 없습니다.");
    }
    
    // 2. [추가 검증] 평점 유효성 검사 (1~5)
    if (rating < 1 || rating > 5) {
        throw new Error("B400: 평점은 1점에서 5점 사이여야 합니다.");
    }

    // 3. 리뷰 등록 Repository 호출
    const reviewId = await addReview(data);

    if (!reviewId) {
        throw new Error("R500: 리뷰 등록에 실패했습니다.");
    }

    return { reviewId };
};

// 미션 등록 비즈니스 로직
export const registerMission = async (data) => {
    const { storeId, minAmount, startDate, endDate } = data;

    // 1. [핵심 검증] 가게 존재 여부 확인
    const store = await getStoreById(storeId);
    if (!store) {
        throw new Error("M404: 미션을 추가할 가게를 찾을 수 없습니다.");
    }

    // 3. 미션 등록 Repository 호출
    const missionId = await addMission(data);

    if (!missionId) {
        throw new Error("M500: 미션 등록에 실패했습니다.");
    }

    return { missionId };
};

/**
 * 미션 도전 시작 비즈니스 로직
 * @param {number} userId - 도전하는 사용자 ID
 * @param {number} missionId - 도전할 미션 ID
 * @returns {object} - 삽입된 미션 도전 기록 ID
 */
export const challengeMission = async (userId, missionId) => {
    // 1. [핵심 검증] 이미 도전 중인 미션인지 확인 (ONGOING 상태)
    const isOngoing = await checkMissionChallenge(userId, missionId);
    
    if (isOngoing) {
        // 이미 도전 중이라면, 명세에 맞게 409 Conflict에 해당하는 에러 코드로 처리
        // 클라이언트에 전달될 에러 메시지: "M409: 이미 도전 중인 미션입니다."
        throw new Error("M409: 이미 도전 중인 미션입니다."); 
    }

    // 2. 미션 도전 기록 삽입 (Repository 호출)
    // mission_attempt 테이블에 'pending' 상태로 추가됨
    const attemptId = await insertMissionAttempt(userId, missionId);
    
    if (!attemptId) {
        // 삽입 실패 시
        throw new Error("M500: 미션 도전 시작에 실패했습니다."); 
    }

    // 3. 성공적으로 삽입된 ID 반환
    return { attemptId };
};