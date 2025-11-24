import {
    findStoreById,
    insertMission,
    findMissionsByStoreId,
    findUserMissions
  } from "../repositories/mission.repository.js";
  
  import { responseFromMission, responseFromUserMission, missionToResponse} from "../dtos/mission.dto.js";
  
  // 가게에 미션을 추가하는 비즈니스 로직
  export const createMission = async (missionDto) => {
    const store = await findStoreById(missionDto.storeId);
  
    if (!store) {
      throw new Error("해당 가게가 존재하지 않습니다.");
    }
  
    const savedMission = await insertMission(missionDto);
    return responseFromMission(savedMission);
  };
  
  // 가게 미션 목록 
  export const getMissionsByStore = async (storeId) => {
    const missions = await findMissionsByStoreId(storeId);
    return missions.map(missionToResponse); // 응답 DTO로 변환해서 반환
  };

  // 유저가 도전한 미션 목록 전체 반환
export const getMyMissions = async (userId) => {
  const userMissions = await findUserMissions(userId);

  return userMissions.map(responseFromUserMission);
};