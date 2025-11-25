import { StatusCodes } from "http-status-codes";
import { bodyToStore } from "../dtos/store.dto.js";
import { addStore, listStoreReviews, listStoreMissions } from "../services/store.service.js";

export const handleAddStore = async (req, res, next) => {
  /*
    #swagger.summary = '가게 추가 API';
    #swagger.tags = ['Store']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["name", "address", "regionId", "storeCategoryId"],
            properties: {
              name: { type: "string", example: "맛있는 식당", description: "가게 이름" },
              address: { type: "string", example: "서울시 강남구 테헤란로 123", description: "가게 주소" },
              regionId: { type: "number", example: 1, description: "지역 ID (region 테이블 참조)" },
              storeCategoryId: { type: "number", example: 1, description: "가게 카테고리 ID (store_category 테이블 참조)" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "가게 추가 성공",
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
                  storeId: { type: "number", example: 1, description: "생성된 가게 ID" },
                  name: { type: "string", example: "맛있는 식당" },
                  address: { type: "string", example: "서울시 강남구 테헤란로 123" },
                  regionId: { type: "number", example: 1 },
                  storeCategoryId: { type: "number", example: 1 },
                  score: { type: "number", example: 0, description: "초기 평점" },
                  createdAt: { type: "string", format: "date-time", example: "2024-01-01T12:00:00Z" }
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
                  errorCode: { type: "string", example: "S001" },
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
      description: "지역 또는 카테고리를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S003" },
                  reason: { type: "string", example: "존재하지 않는 지역 또는 카테고리입니다." },
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
    console.log("지역에 가게 추가!");
    console.log("body:", req.body);
    const store = await addStore(bodyToStore(req.body));
    res.status(StatusCodes.CREATED).success(store);
  } catch (err) {
    next(err);
  }
};

export const handleListStoreReviews = async (req, res, next) => {
  /*
    #swagger.summary = '가게 리뷰 목록 조회 API';
    #swagger.tags = ['Store']
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '가게 ID',
      schema: { type: 'integer', example: 1 }
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '페이지네이션 커서 (이전 응답의 마지막 리뷰 ID). 0이면 처음부터 조회',
      schema: { type: 'integer', default: 0, example: 0 }
    };
    #swagger.responses[200] = {
      description: "가게 리뷰 목록 조회 성공",
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
                        user: { 
                          type: "object", 
                          properties: { 
                            id: { type: "number", example: 1 }, 
                            email: { type: "string", example: "user@example.com" }, 
                            name: { type: "string", example: "홍길동" },
                            nickname: { type: "string", example: "foodlover" }
                          },
                          description: "작성자 정보"
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
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S002" },
                  reason: { type: "string", example: "존재하지 않는 가게입니다." },
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
    const storeId = parseInt(req.params.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const reviews = await listStoreReviews(storeId, cursor);
    res.status(StatusCodes.OK).success(reviews);
  } catch (err) {
    next(err);
  }
};

export const handleListStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '가게 미션 목록 조회 API';
    #swagger.tags = ['Store']
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '가게 ID',
      schema: { type: 'integer', example: 1 }
    };
    #swagger.parameters['cursor'] = {
      in: 'query',
      required: false,
      description: '페이지네이션 커서 (이전 응답의 마지막 미션 ID). 0이면 처음부터 조회',
      schema: { type: 'integer', default: 0, example: 0 }
    };
    #swagger.responses[200] = {
      description: "가게 미션 목록 조회 성공",
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
                        id: { type: "number", example: 1, description: "미션 ID" },
                        storeId: { type: "number", example: 1, description: "가게 ID" },
                        regionId: { type: "number", example: 1, description: "지역 ID" },
                        reward: { type: "number", example: 5000, description: "보상 포인트" },
                        dDay: { type: "string", format: "date-time", nullable: true, example: "2024-12-31T23:59:59Z", description: "미션 마감일 (null이면 제한 없음)" },
                        missionDetail: { type: "string", example: "리뷰 3개 작성하기", description: "미션 내용" },
                        createdAt: { type: "string", format: "date-time", example: "2024-01-01T12:00:00Z", description: "미션 생성일시" }
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
      description: "가게를 찾을 수 없음",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "FAIL" },
              error: {
                type: "object",
                properties: {
                  errorCode: { type: "string", example: "S002" },
                  reason: { type: "string", example: "존재하지 않는 가게입니다." },
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
    const storeId = parseInt(req.params.storeId);
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : 0;
    const missions = await listStoreMissions(storeId, cursor);
    res.status(StatusCodes.OK).success(missions);
  } catch (err) {
    next(err);
  }
};