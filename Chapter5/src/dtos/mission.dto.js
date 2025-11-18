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
        description: body.description,
        rewardPoint: body.rewardPoint,
        // is_active는 DB에서 DEFAULT 1로 자동 설정됩니다.
    };
};