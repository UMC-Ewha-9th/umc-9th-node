import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body)); 
    res.success({ user }); // 표준 응답 포맷 사용
  } catch (err) {
    next(err); // 전역 에러 핸들러로 전달
  }
};
