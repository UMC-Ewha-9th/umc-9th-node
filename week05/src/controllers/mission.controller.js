import { StatusCodes } from "http-status-codes";
import { createMission } from "../services/mission.service.js";
import { bodyToMission } from "../dtos/mission.dto.js";

// 미션 등록 요청을 처리
export const handleCreateMission = async (req, res, next) => {
  console.log("미션 등록 요청이 들어왔습니다!");
  console.log("params:", req.params);
  console.log("body:", req.body);

  try {
    const storeId = req.params.storeId;
    const missionDto = bodyToMission(req.body, storeId);

    const result = await createMission(missionDto);

    return res.status(StatusCodes.CREATED).json({ result });
  } catch (err) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: err.message || "미션 등록 중 오류가 발생했습니다." });
  }
};
