/**
 * 클라이언트의 리뷰 요청 본문(Body) 데이터를
 * Repository 계층으로 전달하기 위해 정리하는 DTO 함수.
 */
export const bodyToReview = (body, storeId, userId) => {
    // 실제 미션 정책에 따라 attempt_id를 찾아야 하지만, 여기서는 임시로 1로 가정
    const attemptId = body.attemptId || 1; 
    
    // DB 저장에 필요한 데이터 정리
    return {
        // FK 값
        attemptId: attemptId, 
        userId: userId, 
        storeId: storeId,

        // 리뷰 내용
        rating: body.rating, // 1~5점
        content: body.content, 
    };
};