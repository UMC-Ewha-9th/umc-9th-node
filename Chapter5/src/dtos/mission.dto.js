/**
 * 클라이언트의 미션 등록 요청 본문(Body) 데이터를
 * Repository 계층으로 전달하기 위해 정리하는 DTO 함수.
 */
export const bodyToMission = (body, storeId) => {
    // start_date와 end_date가 'YYYY-MM-DD' 문자열로 들어온다고 가정합니다.
    
    // DB 저장에 필요한 데이터 정리
    return {
        storeId: storeId,
        minAmount: body.minAmount,
        rewardPoint: body.rewardPoint,
        endDate: body.endDate || null,
        // is_active는 DB에서 DEFAULT 1로 자동 설정됩니다.
    };
};

/**
 * Repository에서 받아온 미션 목록을 클라이언트에게 반환할 응답 형식으로 변환합니다.
 * @param {Array<object>} missions - Repository로부터 받은 미션 객체 배열 (store, category 포함)
 * @returns {Array<object>} 클라이언트에게 전달할 최종 미션 응답 DTO 배열
 */
export const responseFromMissions = (missions) => {
    // D-day 계산 함수
    const calculateDday = (endDate) => {
        if (!endDate) {
            return "상시"; // endDate가 null이면 상시 미션
        }
        
        // D-day 계산 로직
        const today = new Date();
        // 시간을 00:00:00으로 설정하여 날짜 기준으로만 계산
        today.setHours(0, 0, 0, 0); 

        const missionEnd = new Date(endDate);
        missionEnd.setHours(0, 0, 0, 0);
        
        const diffTime = missionEnd.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 올림 처리

        if (diffDays < 0) {
            return "만료"; // 이미 지난 경우
        } else if (diffDays === 0) {
            return "D-day"; // 오늘이 마감일인 경우
        } else {
            return `D-${diffDays}`; // D-n일
        }
    };

    return missions.map(mission => ({
        mission_id: mission.id.toString(), // BigInt는 문자열로 변환
        store_name: mission.store.name,
        category_name: mission.store.category.name, // Store를 통해 Category 정보 접근
        // 미션 내용 필드를 삭제하고, 클라이언트에서 조합하도록 필요한 정보만 전달
        reward_point: mission.rewardPoint,
        min_amount: mission.minAmount.toString(), // Decimal도 문자열로 변환
        is_active: mission.isActive,

        end_date: mission.endDate ? mission.endDate.toISOString() : null,
        
        // 유효 기간 계산
        d_day: calculateDday(mission.endDate),
    }));
};

/**
 * D-day 계산 유틸리티 함수 (responseFromMissions에서 복사/사용)
 */
const calculateDday = (endDate) => {
    if (!endDate) {
        return "상시"; // endDate가 null이면 상시 미션
    }
    
    // D-day 계산 로직
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const missionEnd = new Date(endDate);
    missionEnd.setHours(0, 0, 0, 0);
    
    const diffTime = missionEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 올림 처리

    if (diffDays < 0) {
        return "만료"; // 이미 지난 경우 (Repository에서 필터링되었어야 함)
    } else if (diffDays === 0) {
        return "D-day"; 
    } else {
        return `D-${diffDays}`;
    }
};

/**
 * Repository에서 받아온 활성 미션 도전 목록(MissionAttempt)을 클라이언트에게 반환할 응답 형식으로 변환합니다.
 * @param {Array<object>} attempts - Repository로부터 받은 MissionAttempt 객체 배열
 * @returns {Array<object>} 클라이언트에게 전달할 최종 미션 응답 DTO 배열
 */
export const responseFromActiveMissionAttempts = (attempts) => {
    return attempts.map(attempt => {
        const mission = attempt.mission; // 포함된 Mission 객체
        const storeName = mission.store.name; // 포함된 Store 이름

        return {
            attempt_id: attempt.id.toString(),
            mission_id: mission.id.toString(),
            store_name: storeName,
            min_amount: mission.minAmount.toString(), // Decimal을 문자열로
            reward_point: mission.rewardPoint,
            
            // 유효 기간 계산
            d_day: calculateDday(mission.endDate),
        };
    });
};