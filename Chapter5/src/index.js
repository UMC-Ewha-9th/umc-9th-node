// src/index.js (최종 수정)

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { pool } from "./db.config.js";

// 정적 임포트: 라우터 변수를 임포트와 동시에 선언합니다.
// store.route.final.js 파일을 사용하고 있다고 가정합니다.
import usersRouter from "./routes/users.route.js";
import storesRouter from "./store.route.final.js"; 
import missionsRouter from "./routes/mission.route.js";

// 1. 현재 파일의 디렉토리(__dirname)를 ES Module 환경에 맞게 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // PORT를 환경변수에서 가져오지 못하면 3000 사용

// DB 연결 테스트 함수: 서버 시작 전에 연결 확인
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("Database connection successful!");
        connection.release(); // 연결 해제
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
