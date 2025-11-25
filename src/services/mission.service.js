import {
  checkMissionExists,
  checkUserExists,
  getMission,
  checkMissionInProgress,
  addMyMission as addMyMissionRepo,
  getMyMission
} from "../repositories/mission.repository.js";
import { responseFromMyMission } from "../dtos/mission.dto.js";
import { 
  ValidationError,
  UserNotFoundError,
  MissionNotFoundError,
  AlreadyChallengingMissionError
} from "../errors.js";

// 미션 도전 비즈니스 로직
export const challengeMission = async (data) => {
  // 1. 데이터 검증
  if (!data.userId || !data.missionId) {
    throw new ValidationError(
      "필수 데이터가 누락되었습니다.",
      { userId: data.userId, missionId: data.missionId }
    );
  }
  
  // 2. 사용자 존재 여부 확인
  const userExists = await checkUserExists(data.userId);
  if (!userExists) {
    throw new UserNotFoundError(
      "존재하지 않는 사용자입니다.",
      { userId: data.userId }
    );
  }
  
  // 3. 미션 존재 여부 확인
  const missionExists = await checkMissionExists(data.missionId);
  if (!missionExists) {
    throw new MissionNotFoundError(
      "존재하지 않는 미션입니다.",
      { missionId: data.missionId }
    );
  }
  
  // 4. 이미 도전 중인 미션인지 확인
  const isInProgress = await checkMissionInProgress(data.userId, data.missionId);
  if (isInProgress) {
    throw new AlreadyChallengingMissionError(
      "이미 도전 중인 미션입니다.",
      { userId: data.userId, missionId: data.missionId }
    );
  }
  
  // 5. 미션 정보 조회
  const mission = await getMission(data.missionId);
  
  // 6. 내 미션에 추가
  const myMissionData = {
    userId: data.userId,
    missionId: data.missionId,
    storeId: mission.store_id,
    regionId: mission.region_id,
    missionDetail: mission.mission_detail
  };
  
  const myMissionId = await addMyMissionRepo(myMissionData);
  
  // 7. 생성된 내 미션 조회
  const myMission = await getMyMission(myMissionId);
  
  // 8. DTO로 변환하여 반환
  return responseFromMyMission(myMission);
};