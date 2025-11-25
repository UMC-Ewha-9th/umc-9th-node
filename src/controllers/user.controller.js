import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { userSignUp, listUserReviews, listUserMissions } from "../services/user.service.js";

export const handleUserSignUp = async (req, res, next) => {
  /*
    #swagger.summary = '회원 가입 API';
    #swagger.tags = ['User']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["email", "name", "nickname", "password", "gender", "preferences"],
            properties: {
              email: { type: "string", example: "user@example.com", description: "사용자 이메일 (고유값)" },
              name: { type: "string", example: "홍길동", description: "사용자 이름" },
              nickname: { type: "string", example: "umc_user", description: "사용자 닉네임" },
              password: { type: "string", example: "password1234!", description: "비밀번호" },
              gender: { 
                type: "string", 
                enum: ["MALE", "FEMALE", "OTHER"],
                example: "FEMALE",
                description: "성별 (MALE, FEMALE, OTHER)"
              },
              birth: { type: "string", format: "date", example: "2000-01-01", description: "생년월일" },
              address: { type: "string", example: "서울시 강남구", description: "주소" },
              phoneNum: { type: "string", example: "01012345678", description: "전화번호 (하이픈 없이)" },
              preferences: { 
                type: "array", 
                items: { type: "number" },
                example: [1, 2, 3],
                description: "선호 음식 카테고리 ID 배열"
              }
            }
          }
        }
      }
    };
    #swagger.responses[200] = {
      description: "회원 가입 성공",
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
                  userId: { type: "number", example: 1, description: "생성된 사용자 ID" },
                  email: { type: "string", example: "user@example.com" },
                  name: { type: "string", example: "홍길동" },
                  nickname: { type: "string", example: "umc_user" },
                  preferCategory: { 
                    type: "array", 
                    items: { type: "string" },
                    example: ["한식", "중식"],
                    description: "선호 음식 카테고리 이름 목록"
                  }
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
                  errorCode: { type: "string", example: "U001" },
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
    #swagger.responses[409] = {
      description: "이메일 중복 - 이미 존재하는 이메일",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U002" },
                  reason: { type: "string", example: "이미 존재하는 이메일입니다." },
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
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);
    const user = await userSignUp(bodyToUser(req.body));
    res.status(StatusCodes.OK).success(user);
  } catch (err) {
    next(err);
  }
};

export const handleListUserReviews = async (req, res, next) => {
  /*
    #swagger.summary = '내가 작성한 리뷰 목록 조회 API';
    #swagger.tags = ['User']
    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '사용자 ID',
      schema: { type: 'integer', example: 1 }
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '페이지네이션 커서 (이전 응답의 마지막 리뷰 ID). 0이면 처음부터 조회',
      schema: { type: 'integer', default: 0, example: 0 }
    };
    #swagger.responses[200] = {
      description: "리뷰 목록 조회 성공",
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
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1, description: "리뷰 ID" },
                        storeId: { type: "number", example: 1, description: "가게 ID" },
                        userId: { type: "number", example: 1, description: "작성자 ID" },
                        score: { type: "number", example: 4.5, description: "평점 (0~5)" },
                        contents: { type: "string", example: "정말 맛있어요!", description: "리뷰 내용" },
                        createdAt: { type: "string", format: "date-time", example: "2024-01-01T12:00:00Z", description: "작성일시" },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "맛있는 식당" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 10, description: "다음 페이지 조회를 위한 커서 (마지막 리뷰 ID). null이면 마지막 페이지" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U003" },
                  reason: { type: "string", example: "존재하지 않는 사용자입니다." },
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
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const reviews = await listUserReviews(userId, cursor);
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    next(err);
  }
};

export const handleListUserMissions = async (req, res, next) => {
  /*
    #swagger.summary = '내가 진행 중인 미션 목록 조회 API';
    #swagger.tags = ['User']
    #swagger.parameters['userId'] = {
      in: 'path',
      required: true,
      description: '사용자 ID',
      schema: { type: 'integer', example: 1 }
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '페이지네이션 커서 (이전 응답의 마지막 미션 ID). 0이면 처음부터 조회',
      schema: { type: 'integer', default: 0, example: 0 }
    };
    #swagger.responses[200] = {
      description: "미션 목록 조회 성공",
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
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1, description: "내 미션 ID" },
                        missionId: { type: "number", example: 1, description: "미션 ID" },
                        storeId: { type: "number", example: 1, description: "가게 ID" },
                        status: { 
                          type: "string", 
                          enum: ["PENDING", "IN_PROGRESS", "SUCCESS", "FAILED", "CANCELLED"],
                          example: "IN_PROGRESS",
                          description: "미션 상태"
                        },
                        missionDetail: { type: "string", example: "리뷰 3개 작성하기", description: "미션 내용" },
                        reward: { type: "number", example: 5000, description: "보상 포인트" },
                        missionCount: { type: "number", example: 1, description: "현재 진행 횟수" },
                        startedAt: { type: "string", format: "date-time", nullable: true, example: "2024-01-01T12:00:00Z", description: "시작일시" },
                        completedAt: { type: "string", format: "date-time", nullable: true, example: null, description: "완료일시" },
                        store: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            name: { type: "string", example: "맛있는 식당" }
                          }
                        }
                      }
                    }
                  },
                  pagination: {
                    type: "object",
                    properties: {
                      cursor: { type: "number", nullable: true, example: 10, description: "다음 페이지 조회를 위한 커서. null이면 마지막 페이지" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    #swagger.responses[404] = {
      description: "사용자를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "U003" },
                  reason: { type: "string", example: "존재하지 않는 사용자입니다." },
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
    const userId = parseInt(req.params.userId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const missions = await listUserMissions(userId, cursor);
    res.status(StatusCodes.OK).success(missions);
  } catch (err) {
    next(err);
  }
};