import { StatusCodes } from "http-status-codes";
import { bodyToMyMission } from "../dtos/mission.dto.js";
import { challengeMission } from "../services/mission.service.js";

export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전하기 API';
    #swagger.tags = ['Mission']
    #swagger.parameters['missionId'] = {
      in: 'path',
      required: true,
      description: '도전할 미션 ID',
      schema: { type: 'integer', example: 1 }
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId"],
            properties: {
              userId: { type: "number", example: 1, description: "미션에 도전하는 사용자 ID" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "미션 도전 등록 성공",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  userMissionId: { type: "number", example: 1, description: "생성된 사용자 미션 ID" },
                  userId: { type: "number", example: 1, description: "사용자 ID" },
                  missionId: { type: "number", example: 1, description: "미션 ID" },
                  status: { type: "string", example: "도전중", description: "미션 상태 (도전중/완료)" },
                  startedAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z", description: "미션 시작 시간" }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[400] = {
      description: "잘못된 요청 - 필수 데이터 누락 또는 유효하지 않은 데이터",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M001" },
                  reason: { type: "string", example: "필수 데이터가 누락되었습니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "미션을 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M002" },
                  reason: { type: "string", example: "존재하지 않는 미션입니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[409] = {
      description: "이미 도전 중인 미션",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M003" },
                  reason: { type: "string", example: "이미 도전 중인 미션입니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
    #swagger.responses[500] = {
      description: "서버 내부 오류",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "M999" },
                  reason: { type: "string", example: "서버 오류가 발생했습니다." },
                  data: { type: "object", nullable: true }
                }
              },
              success: { type: "object", nullable: true, example: null }
            }
          }
        }
      }
    };
  */
  try {
    console.log("미션 도전!");
    console.log("body:", req.body);

    const myMission = await challengeMission(bodyToMyMission(req.body));
    
    res.status(StatusCodes.CREATED).success(myMission);
  } catch (err) {
    next(err);
  }
};