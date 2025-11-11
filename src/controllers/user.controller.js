import { StatusCodes } from "http-status-codes"; //HTTP 응답 상태 코드를 숫자로 표시 
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";
import { listUserReviews,listUserMissions } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => { //회원가입 요청이 들어왔을 때 실행
  console.log("회원가입을 요청했습니다!"); //controller는 비동기(async,await)
  console.log("body:", req.body); // 값이 잘 들어오나 확인하기 위한 테스트용, req : HTTP요청 데이터, req.body:회원가입 데이터 

  const user = await userSignUp(bodyToUser(req.body));
  res.status(StatusCodes.OK).json({ result: user });//res:응답을 보내는 객체 
};

//내가 작성한 모든 리뷰 조회 
export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    const reviews = await listUserReviews(userId, cursor);
    
    res.status(StatusCodes.OK).json({ // ⚠️ .success() -> .json()
      success: true,
      result: reviews
    });
  } catch (err) {
    next(err);
  }
};

//내가 진행 중인 모든 미션 조회 
export const handleListUserMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    const missions = await listUserMissions(userId, cursor);
    
    res.status(StatusCodes.OK).json({ // ⚠️ .success() -> .json()
      success: true,
      result: missions
    });
  } catch (err) {
    next(err);
  }
};