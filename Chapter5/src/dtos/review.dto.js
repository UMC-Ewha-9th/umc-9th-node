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

/**
 * Repository에서 받아온 리뷰 목록을 클라이언트에게 반환할 응답 형식으로 변환합니다.
 * @param {Array<object>} reviews - Repository로부터 받은 리뷰 객체 배열 (user.name 포함)
 * @returns {Array<object>} 클라이언트에게 전달할 최종 리뷰 응답 DTO 배열
 */
export const responseFromReviews = (reviews) => {
    return reviews.map(review => ({
        review_id: review.id,
        user_name: review.user.name, // 사용자 이름 포함
        rating: review.rating,
        content: review.content,
        created_at: review.createdAt,
    }));
};
