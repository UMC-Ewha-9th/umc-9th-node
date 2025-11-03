import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 숫자로 표시 
import { bodyToMission } from "../dtos/mission.dto.js";
import { challengeMission } from "../services/mission.service.js";

export const handleChallengeMission = async (req, res, next) => { 
  
  try{
    console.log("미션 도전!"); //controller는 비동기(async,await)
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용, req : HTTP요청 데이터, req.body:회원가입 데이터 

    const myMission = await challengeMission(bodyToMission(req.body)); //body를 dto로 변환. --> service 호출 

      // 성공 응답
    res.status(StatusCodes.CREATED).json({ 
      success: true,
      message: "미션 도전을 시작합니다.",
      result: myMission
    });
    
  } catch (err) {
    // 에러는 next()로 전달하여 에러 핸들러가 처리하도록
    next(err);
  }
};