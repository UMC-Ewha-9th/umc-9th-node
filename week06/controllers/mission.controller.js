import { createMission, getMyMissions } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";

// 미션 등록 요청 처리
export const handleCreateMission = async (req, res, next) => {
  try {
    console.log("미션 등록 요청이 들어왔습니다!");
    console.log("params:", req.params);
    console.log("body:", req.body);

    const storeId = req.params.storeId;
    const missionDto = bodyToMission(req.body, storeId);

    const mission = await createMission(missionDto);

    res.success({ mission });
  } catch (err) {
    next(err); 
  }
};

// 내가 도전 중인 미션 목록 조회
export const handleGetMyMissions = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const missions = await getMyMissions(userId);

    res.success({ missions }); 
  } catch (err) {
    next(err);
  }
};
