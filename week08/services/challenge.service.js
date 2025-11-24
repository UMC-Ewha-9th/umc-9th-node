import {
    findUserById,
    findMissionById,
    hasUserChallenged,
    insertChallenge,
  } from "../repositories/challenge.repository.js";
  
  import { responseFromChallenge } from "../dtos/challenge.dto.js";
  
  // 미션 도전 비즈니스 로직
  export const challengeMission = async (userId, missionId) => {
    const user = await findUserById(userId);
    if (!user) throw new Error("사용자가 존재하지 않습니다.");
  
    const mission = await findMissionById(missionId);
    if (!mission) throw new Error("미션이 존재하지 않습니다.");
  
    const alreadyChallenged = await hasUserChallenged(userId, missionId);
    if (alreadyChallenged) {
      throw new Error("이미 도전한 미션입니다.");
    }
  
    const record = await insertChallenge(userId, missionId);
    return responseFromChallenge(record);
  };
  