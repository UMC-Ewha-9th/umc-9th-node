import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 숫자로 표시 
import { bodyToMyMission } from "../dtos/mission.dto.js";
import { challengeMission } from "../services/mission.service.js";

export const handleChallengeMission = async (req, res, next) => { 
  try {
    console.log("미션 도전!"); //controller는 비동기(async,await)
    console.log("body:", req.body);// 값이 잘 들어오나 확인하기 위한 테스트용, req : HTTP요청 데이터, req.body:회원가입 데이터 


    const myMission = await challengeMission(bodyToMyMission(req.body));
    
    // .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.CREATED).success(myMission);
  } catch (err) {
    next(err);
  }
};