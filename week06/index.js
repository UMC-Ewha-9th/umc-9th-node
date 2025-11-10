import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { CustomError } from "./utils/errors/customError.js";

// Controller
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleStoreCreate, handleListStoreReviews, handleListStoreMissions } from './controllers/store.controller.js';
import { handleCreateReview, handleGetMyReviews } from "./controllers/review.controller.js";
import { handleCreateMission, handleGetMyMissions } from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/challenge.controller.js";

// 환경 변수 설정
dotenv.config();

// Express 앱 초기화
const app = express();
const port = process.env.PORT;

// 기본 미들웨어
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 로깅 및 쿠키 파서
app.use(morgan("dev"));
app.use(cookieParser());

// 응답 구조 미들웨어
app.use((req, res, next) => {
  res.success = (data) => res.json({
    resultType: "SUCCESS",
    error: null,
    success: data,
  });

  res.error = ({ errorCode = "unknown", reason = null, data = null }) => res.json({
    resultType: "FAIL",
    error: { errorCode, reason, data },
    success: null,
  });

  next();
});

// 라우팅
app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/stores", handleStoreCreate);
app.post("/api/v1/stores/:storeId/reviews", handleCreateReview);
app.post("/api/v1/stores/:storeId/missions", handleCreateMission);
app.post("/api/v1/users/:userId/missions/:missionId/challenge", handleChallengeMission);
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/reviews/my", handleGetMyReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);
app.get("/api/v1/users/:userId/missions", handleGetMyMissions);

// 전역 에러 핸들링
app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    return res.error({
      errorCode: err.errorCode,
      reason: err.reason,
      data: err.data,
    });
  }

  console.error(err);

  return res.status(500).json({
    resultType: "FAIL",
    error: {
      errorCode: "INTERNAL_SERVER_ERROR",
      reason: "서버 내부 오류입니다.",
    },
    success: null,
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
