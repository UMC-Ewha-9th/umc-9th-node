import { addStore as addStoreRepo, getAllStoreReviews, getAllStoreMissions, getStore } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { responseFromReviews } from "../dtos/review.dto.js";
import { responseFromMissions } from "../dtos/mission.dto.js";

// 가게 추가 비즈니스 로직
export const addStore = async (data) => {
  // 1. 데이터 검증
  if (!data.regionId || !data.storeCategoryId || !data.name || !data.address) {
    throw new Error("필수 데이터가 누락되었습니다.");
  }
  
  // 2. Repository를 통해 DB에 저장
  const storeId = await addStoreRepo(data);
  
  // 3. 저장된 가게 정보 조회
  const store = await getStore(storeId);
  
  // 4. DTO로 변환하여 반환
  return responseFromStore(store);
};

//가게에 속한 모든 리뷰 조회 
export const listStoreReviews = async (storeId, cursor) => {
  const reviews = await getAllStoreReviews(storeId, cursor);
  return responseFromReviews(reviews);
};

//가게에 속한 모든 리뷰 조회 
export const listStoreMissions = async (storeId, cursor) => {
  const reviews = await getAllStoreMissions(storeId, cursor);
  return responseFromMissions(reviews);
};