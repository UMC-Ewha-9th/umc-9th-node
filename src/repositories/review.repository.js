import { prisma } from "../db.config.js";

//////////////////////외래키 검증 함수////////////////////////////////

// 지역 존재 확인 (region_id)
export const checkRegionExists = async (regionId) => {
  try {
    const region = await prisma.region.findUnique({
      where: { id: regionId },
      select: { id: true }
    });
    return region !== null;
  } catch (err) {
    throw new Error(`지역 조회 실패: ${err.message}`);
  }
};

////////////////////////////리뷰 추가////////////////////////////////

// review 데이터 삽입
export const addReview = async (data) => {
  try {
    const review = await prisma.review.create({
      data: {
        storeId: data.storeId,
        userId: data.userId,
        score: data.score,
        contents: data.contents
      }
    });
    return review.id;
  } catch (err) {
    throw new Error(`리뷰 추가 실패. (${err.message})`);
  }
};

////////////////////////////////////////////////////////////////

// 특정 가게에서 리뷰 목록 조회
export const getReviewsByStore = async (storeId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { storeId: storeId }
    });
    return reviews;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  }
};

// 자신이 쓴 리뷰 목록 조회
export const getReviewsByUser = async (userId) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { userId: userId }
    });
    return reviews;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  }
};

// 특정 리뷰 조회 (ID로)
export const getReview = async (reviewId) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    });
    return review; // 단일 리뷰 반환 (없으면 null)
  } catch (err) {
    throw new Error(`리뷰 조회 실패: ${err.message}`);
  }
};