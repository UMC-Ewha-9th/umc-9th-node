import { findStoreById, insertReview } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";

// 가게에 리뷰 작성 로직
export const createReview = async (reviewDto) => {
  const store = await findStoreById(reviewDto.storeId);

  if (!store) {
    throw new Error("해당 가게를 찾을 수 없습니다.");
  }

  const saved = await insertReview(reviewDto);
  return responseFromReview(saved);
};
