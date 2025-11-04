// 요청 body를 Store 객체로 변환
export const bodyToReview = (body) => {
  return {
    storeId: body.storeId,
    userId:body.userId,
    score:body.score,
    contents:body.contents
  };
};

// DB 결과를 응답 형태로 변환
export const responseFromReview = (review) => {
  return {
    id: review.id,
    storeId: review.store_id,
    userId:review.user_id,
    score: review.score,
    contents:review.contents,
    createdAt: review.created_at
  };
};