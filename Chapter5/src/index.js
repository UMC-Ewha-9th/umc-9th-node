// src/index.js
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { prisma } from "./db.config.js";
import usersRouter from "./routes/users.route.js";
import storesRouter from "./store.route.final.js";
import missionsRouter from "./routes/mission.route.js";
import { handleListStoreReviews } from "./controllers/store.controller.js";

// index.js에서도 dotenv.config()를 호출하여
// 혹시 db.config.js보다 먼저 환경 변수가 필요한 부분이 있는지 대비합니다.
dotenv.config();

const app = express();
// 환경 변수에서 PORT를 가져옵니다.
const port = process.env.PORT || 3000;

// Prisma를 이용한 DB 연결 테스트 함수로 대체
async function testConnection() {
    try {
        await prisma.$connect(); // Prisma를 통해 DB 연결을 시도합니다.
        console.log("Database connection successful using Prisma!");
        return true;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        return false;
    }
}

// 2. 비동기 함수(IIFE) 내부에서 앱을 시작합니다.
async function initializeApp() {
    // DB 연결 테스트를 먼저 수행합니다.
    if (!await testConnection()) {
        console.error("Critical Error: Database connection failed. Shutting down server.");
        process.exit(1);
    }
    
    try {
        // 3. 미들웨어 설정 및 라우트 연결
        app.use(express.json());
        
        app.use(cors());
        app.use(express.static('public'));
        app.use(express.urlencoded({ extended: false }));

        app.get("/", (req, res) => {
            res.send("Hello World!");
        });

        app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);

        // 모든 라우터 app.use로 연결
        app.use("/api/v1/users", usersRouter); 
        app.use("/api/v1/stores", storesRouter); 
        app.use("/api/v1/missions", missionsRouter);

        // 4. 전역 에러 핸들러 미들웨어 추가 (가장 마지막에 위치해야 함)
        app.use((err, req, res, next) => {
            console.error(err.stack); // 에러 로그를 콘솔에 출력

            // 1. 에러 메시지에서 커스텀 코드(예: 'M409')와 메시지 추출
            const errMessage = err.message || "서버 내부 오류";
            let statusCode = 500; // 기본 상태 코드는 500 (Internal Server Error)
            let code = "A500"; 
            let message = errMessage;

            // 커스텀 코드(M409, S404 등)가 포함된 에러 메시지 처리
            // 예: "M409: 이미 도전 중인 미션입니다."
            const customMatch = errMessage.match(/^([A-Z]\d{3}):\s*(.*)/);

            if (customMatch) {
                code = customMatch[1]; // 예: "M409"
                message = customMatch[2]; // 예: "이미 도전 중인 미션입니다."

                // 코드 접두사에 따라 상태 코드 결정
                if (code.startsWith('B')) { // B400 (Bad Request)
                    statusCode = 400;
                } else if (code.endsWith('404')) { // M404, S404 (Not Found)
                    statusCode = 404;
                } else if (code.endsWith('409')) { // M409 (Conflict - 중복)
                    statusCode = 409;
                }
            }
            
            // 2. JSON 형식으로 응답 전송
            res.status(statusCode).json({
                success: false,
                code: code,
                message: message,
            });
        });

        // 5. 앱 리스닝 시작
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    } catch (e) {
        console.error("Initialization Error: Failed to load modules or start server.", e);
        // 모듈 로드 오류 시 서버 시작을 중단합니다.
    }
}

// 5. 앱 초기화 함수 호출
initializeApp();