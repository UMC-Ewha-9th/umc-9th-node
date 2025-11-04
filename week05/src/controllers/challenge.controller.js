import { StatusCodes } from "http-status-codes";
import { paramsToChallenge } from "../dtos/challenge.dto.js";
import { challengeMission } from "../services/challenge.service.js";

// 미션 도전 요청 처리
export const handleChallengeMission = async (req, res, next) => {
  console.log("미션 도전 요청이 들어왔습니다!");
  console.log("params:", req.params);

  try {
    const { userId, missionId } = req.params;
    const { userId: uId, missionId: mId } = paramsToChallenge(userId, missionId);

    const result = await challengeMission(uId, mId);

    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: err.message || "미션 도전 중 오류 발생" });
  }
};
