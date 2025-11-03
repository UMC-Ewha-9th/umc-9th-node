import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 숫자로 표시 
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => { //회원가입 요청이 들어왔을 때 실행
  
  try{
    console.log("가게에 리뷰 추가!"); //controller는 비동기(async,await)
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용, req : HTTP요청 데이터, req.body:회원가입 데이터 

    const store = await addStore(bodyToReview(req.body)); //body를 dto로 변환. --> service 호출 

      // 성공 응답
    res.status(StatusCodes.CREATED).json({ 
      success: true,
      message: "리뷰가 성공적으로 추가되었습니다.",
      result: review
    });
    
  } catch (err) {
    // 에러는 next()로 전달하여 에러 핸들러가 처리하도록
    next(err);
  }
};