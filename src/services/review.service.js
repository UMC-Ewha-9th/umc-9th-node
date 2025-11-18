import { addReview as addReviewRepo, getReview } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";
import { ValidationError, ReviewNotFoundError } from "../errors.js";

// 리뷰 추가 비즈니스 로직
export const addReview = async (data) => {
  // 1. 데이터 검증
  if (!data.storeId || !data.userId || !data.score || !data.contents) {
    throw new ValidationError(
      "필수 데이터가 누락되었습니다.",
      { 
        storeId: data.storeId, 
        userId: data.userId, 
        score: data.score, 
        contents: data.contents 
      }
    );
  }

  // 2. 평점 범위 검증 (1-5)
  if (data.score < 1 || data.score > 5) {
    throw new ValidationError(
      "평점은 1에서 5 사이의 값이어야 합니다.",
      { score: data.score }
    );
  }
  
  // 3. Repository를 통해 DB에 저장
  const reviewId = await addReviewRepo(data);
  
  // 4. 저장된 리뷰 정보 조회
  const review = await getReview(reviewId);
  
  // 5. 리뷰 조회 실패 처리
  if (!review) {
    throw new ReviewNotFoundError(
      "리뷰 저장 후 조회에 실패했습니다.",
      { reviewId }
    );
  }
  
  // 6. DTO로 변환하여 반환
  return responseFromReview(review);
};