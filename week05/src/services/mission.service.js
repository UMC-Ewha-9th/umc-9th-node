import {
    findStoreById,
    insertMission,
  } from "../repositories/mission.repository.js";
  
  import { responseFromMission } from "../dtos/mission.dto.js";
  
  // 가게에 미션을 추가하는 비즈니스 로직
  export const createMission = async (missionDto) => {
    const store = await findStoreById(missionDto.storeId);
  
    if (!store) {
      throw new Error("해당 가게가 존재하지 않습니다.");
    }
  
    const savedMission = await insertMission(missionDto);
    return responseFromMission(savedMission);
  };
  