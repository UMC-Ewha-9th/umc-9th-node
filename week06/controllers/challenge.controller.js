import { paramsToChallenge } from "../dtos/challenge.dto.js";
import { challengeMission } from "../services/challenge.service.js";

// 미션 도전 요청 처리
export const handleChallengeMission = async (req, res, next) => {
  try {
    console.log("미션 도전 요청이 들어왔습니다!");
    console.log("params:", req.params);

    const { userId, missionId } = req.params;
    const { userId: uId, missionId: mId } = paramsToChallenge(userId, missionId);

    const challenge = await challengeMission(uId, mId);

    res.success({ challenge }); 
  } catch (err) {
    next(err); 
  }
};
