import { addReview as addReviewRepo, getReview } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";

// 가게 추가 비즈니스 로직
export const addReview = async (data) => {
  // 1. 데이터 검증
  if (!data.storeId || !data.userId || !data.score || !data.contents) {
    throw new Error("필수 데이터가 누락되었습니다.");
  }
  
  // 2. Repository를 통해 DB에 저장
  const reviewId = await addReviewRepo(data);
  
  // 3. 저장된 가게 정보 조회
  const review = await getReview(reviewId);
  
  // 4. DTO로 변환하여 반환
  return responseFromReview(review);
};