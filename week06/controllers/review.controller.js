import { createReview, getMyReviews } from "../services/review.service.js";
import { bodyToReview } from "../dtos/review.dto.js";

// 리뷰 등록
export const handleCreateReview = async (req, res, next) => {
  try {
    console.log("리뷰 등록 요청 도착!");
    console.log("params:", req.params);
    console.log("body:", req.body);

    const storeId = req.params.storeId;
    const reviewDto = bodyToReview(req.body, storeId);

    const review = await createReview(reviewDto);

    res.success({ review }); 
  } catch (err) {
    next(err); 
  }
};

// 내가 작성한 리뷰 조회
export const handleGetMyReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const reviews = await getMyReviews(userId);

    res.success({ reviews });
  } catch (err) {
    next(err); 
  }
};
