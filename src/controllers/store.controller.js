import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 숫자로 표시 
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore } from "../services/store.service.js";
import { listStoreReviews } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => { //회원가입 요청이 들어왔을 때 실행
  
  try{
    console.log("지역에 가게 추가!"); //controller는 비동기(async,await)
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용, req : HTTP요청 데이터, req.body:회원가입 데이터 

    const store = await addStore(bodyToStore(req.body)); //body를 dto로 변환. --> service 호출 

      // 성공 응답
    res.status(StatusCodes.CREATED).json({ 
      success: true,
      message: "가게가 성공적으로 추가되었습니다.",
      result: store 
    });
    
  } catch (err) {
    // 에러는 next()로 전달하여 에러 핸들러가 처리하도록
    next(err);
  }
};

//가게에 속한 모든 리뷰 조회 
export const handleListStoreReviews = async (req, res, next) => {
  try {
    const storeId = parseInt(req.params.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    console.log('🔍 Controller - storeId:', storeId);
    console.log('🔍 Controller - cursor from query:', req.query.cursor);
    console.log('🔍 Controller - parsed cursor:', cursor);
    
    const reviews = await listStoreReviews(storeId, cursor);
    
    res.status(StatusCodes.OK).json({ // ⚠️ .success() -> .json()
      success: true,
      result: reviews
    });
  } catch (err) {
    next(err);
  }
};