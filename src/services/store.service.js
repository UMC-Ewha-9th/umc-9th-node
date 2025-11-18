import { 
  addStore as addStoreRepo, 
  getAllStoreReviews, 
  getAllStoreMissions, 
  getStore 
} from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { responseFromReviews } from "../dtos/review.dto.js";
import { responseFromMissions } from "../dtos/mission.dto.js";
import { ValidationError, StoreNotFoundError } from "../errors.js";

// 가게 추가 비즈니스 로직
export const addStore = async (data) => {
  // 1. 데이터 검증
  if (!data.regionId || !data.storeCategoryId || !data.name || !data.address) {
    throw new ValidationError(
      "필수 데이터가 누락되었습니다.",
      { 
        regionId: data.regionId, 
        storeCategoryId: data.storeCategoryId, 
        name: data.name, 
        address: data.address 
      }
    );
  }
  
  // 2. Repository를 통해 DB에 저장
  const storeId = await addStoreRepo(data);
  
  // 3. 저장된 가게 정보 조회
  const store = await getStore(storeId);
  
  // 4. 가게 조회 실패 처리
  if (!store) {
    throw new StoreNotFoundError(
      "가게 저장 후 조회에 실패했습니다.",
      { storeId }
    );
  }
  
  // 5. DTO로 변환하여 반환
  return responseFromStore(store);
};

// 가게에 속한 모든 리뷰 조회 
export const listStoreReviews = async (storeId, cursor) => {
  // 1. storeId 유효성 검증
  if (!storeId || isNaN(storeId)) {
    throw new ValidationError(
      "유효하지 않은 가게 ID입니다.",
      { storeId }
    );
  }

  // 2. cursor 유효성 검증
  if (cursor < 0) {
    throw new ValidationError(
      "커서 값은 0 이상이어야 합니다.",
      { cursor }
    );
  }
  
  // 3. 리뷰 목록 조회
  const reviews = await getAllStoreReviews(storeId, cursor);
  
  // 4. DTO로 변환하여 반환
  return responseFromReviews(reviews);
};

// 가게에 속한 모든 미션 조회 
export const listStoreMissions = async (storeId, cursor) => {
  // 1. storeId 유효성 검증
  if (!storeId || isNaN(storeId)) {
    throw new ValidationError(
      "유효하지 않은 가게 ID입니다.",
      { storeId }
    );
  }

  // 2. cursor 유효성 검증
  if (cursor < 0) {
    throw new ValidationError(
      "커서 값은 0 이상이어야 합니다.",
      { cursor }
    );
  }
  
  // 3. 미션 목록 조회
  const missions = await getAllStoreMissions(storeId, cursor);
  
  // 4. DTO로 변환하여 반환
  return responseFromMissions(missions);
};