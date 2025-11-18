import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore, listStoreReviews, listStoreMissions } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  try {
    console.log("지역에 가게 추가!");
    console.log("body:", req.body);

    const store = await addStore(bodyToStore(req.body));
    
    // .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.CREATED).success(store);
  } catch (err) {
    next(err);
  }
};

// 가게에 속한 모든 리뷰 조회 
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const reviews = await listStoreReviews(storeId, cursor);
    
    // .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    next(err);
  }
};

// 가게의 모든 미션 조회
export const handleListStoreMissions = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const missions = await listStoreMissions(storeId, cursor);
    
    // .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.OK).success(missions);
  } catch (err) {
    next(err);
  }
};