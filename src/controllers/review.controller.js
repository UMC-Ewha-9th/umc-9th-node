import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 숫자로 표시 
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => { 
   try {
    console.log("가게에 리뷰 추가!");//controller는 비동기(async,await)
    console.log("body:", req.body);// 값이 잘 들어오나 확인하기 위한 테스트용, req : HTTP요청 데이터, req.body:회원가입 데이터 


    const review = await addReview(bodyToReview(req.body));
    
    // .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.CREATED).success(review);
  } catch (err) {
    next(err);
  }
};