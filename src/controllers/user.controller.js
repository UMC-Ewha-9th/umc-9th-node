import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, listUserReviews, listUserMissions } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);
    
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    next(err);
  }
};

// 내가 작성한 모든 리뷰 조회 
export const handleListUserReviews = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    const reviews = await listUserReviews(userId, cursor);
    
    //  .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    next(err);
  }
};

// 내가 진행 중인 모든 미션 조회 
export const handleListUserMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    
    const missions = await listUserMissions(userId, cursor);
    
    // .success() 사용으로 표준 응답 규격 적용
    res.status(StatusCodes.OK).success(missions);
  } catch (err) {
    next(err);
  }
};