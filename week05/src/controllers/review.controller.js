import { StatusCodes } from "http-status-codes";
import { createReview } from "../services/review.service.js";
import { bodyToReview } from "../dtos/review.dto.js";

// 리뷰 생성 요청 처리
export const handleCreateReview = async (req, res, next) => {
  console.log("리뷰 등록 요청 도착!");
  console.log("params:", req.params); // storeId
  console.log("body:", req.body);     // userId, rating, content

  try {
    const storeId = req.params.storeId;
    const reviewDto = bodyToReview(req.body, storeId);

    const result = await createReview(reviewDto);

    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: err.message || "리뷰 등록 중 오류가 발생했습니다." });
  }
};
