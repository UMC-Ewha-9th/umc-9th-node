import { StatusCodes } from "http-status-codes";
import { bodyToReview } from "../dtos/review.dto.js";
import { addReview } from "../services/review.service.js";

export const handleAddReview = async (req, res, next) => {
  /*
    #swagger.summary = '가게에 리뷰 추가 API';
    #swagger.tags = ['Review']
    #swagger.parameters['storeId'] = {
      in: 'path',
      required: true,
      description: '리뷰를 작성할 가게 ID',
      schema: { type: 'integer', example: 1 }
    };
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            required: ["userId", "score", "contents"],
            properties: {
              userId: { type: "number", example: 1, description: "리뷰를 작성하는 사용자 ID" },
              score: { type: "number", example: 4.5, description: "별점 (0.0 ~ 5.0)", minimum: 0, maximum: 5 },
              contents: { type: "string", example: "음식이 정말 맛있었습니다!", description: "리뷰 내용" }
            }
          }
        }
      }
    };
    #swagger.responses[201] = {
      description: "리뷰 추가 성공",
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
                  reviewId: { type: "number", example: 1, description: "생성된 리뷰 ID" },
                  storeId: { type: "number", example: 1, description: "가게 ID" },
                  userId: { type: "number", example: 1, description: "사용자 ID" },
                  score: { type: "number", example: 4.5, description: "별점" },
                  contents: { type: "string", example: "음식이 정말 맛있었습니다!", description: "리뷰 내용" },
                  createdAt: { type: "string", format: "date-time", example: "2024-01-15T10:30:00Z", description: "리뷰 작성 시간" }
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
                  errorCode: { type: "string", example: "R001" },
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
                  errorCode: { type: "string", example: "R002" },
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
                  errorCode: { type: "string", example: "R999" },
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
    console.log("가게에 리뷰 추가!");
    console.log("body:", req.body);

    const review = await addReview(bodyToReview(req.body));
    
    res.status(StatusCodes.CREATED).success(review);
  } catch (err) {
    next(err);
  }
};