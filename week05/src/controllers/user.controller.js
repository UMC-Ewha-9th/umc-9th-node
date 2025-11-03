import { StatusCodes } from "http-status-codes"; // 상태코드 라이브러리 
import { bodyToUser } from "../dtos/user.dto.js"; // 데이터를 다루기 편한 구조로 바꿔주는 함수 
import { userSignUp } from "../services/user.service.js"; // 핵심 로직은 service가 처리함 

export const handleUserSignUp = async (req, res, next) => {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용
  
    const user = await userSignUp(bodyToUser(req.body)); // DTO 형태로 데이터 변환해 함수에 넘김 
    res.status(StatusCodes.OK).json({ result: user });
}