// 클라이언트 body를 내부 로직용 DTO로 변환
export const bodyToReview = (body, storeId) => {
    return {
      storeId: parseInt(storeId),         // URL 파라미터 (가게 ID)
      userId: parseInt(body.userId),      // 작성자 ID
      rating: parseFloat(body.rating),    // 별점 (1~5)
      content: body.content,              // 리뷰 본문
    };
  };
  
  // DB에서 insert된 결과를 응답 포맷으로 변환
  export const responseFromReview = (review) => {
    return {
      id: review.id,
      storeId: review.store_id,
      userId: review.user_id,
      rating: review.rating,
      content: review.content,
      createdAt: review.created_at,
    };
  };
  