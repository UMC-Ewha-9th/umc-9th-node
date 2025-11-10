import { bodyToStore } from "../dtos/store.dto.js";
import { createStore } from "../services/store.service.js";
import { getMissionsByStore } from "../services/mission.service.js";
import { listStoreReviews } from "../services/review.service.js"; // 누락된 부분 추가

// 가게 등록 API
export const handleStoreCreate = async (req, res, next) => {
  try {
    console.log("가게 등록 요청이 들어왔습니다!");
    console.log("body:", req.body);

    const storeDto = bodyToStore(req.body);
    const store = await createStore(storeDto);

    res.success({ store }); 
  } catch (error) {
    next(error); 
  }
};

// 가게 리뷰 목록 조회
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0;

    const reviews = await listStoreReviews(storeId, cursor);

    res.success({ reviews }); 
  } catch (error) {
    next(error); 
  }
};

// ✅ 가게 미션 목록 조회
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);

    const missions = await getMissionsByStore(storeId);

    res.success({ missions });
  } catch (error) {
    next(error); 
  }
};
