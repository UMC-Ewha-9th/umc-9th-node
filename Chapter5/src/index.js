import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieparser from "cookie-parser";

import { prisma } from "./db.config.js";
import usersRouter from "./routes/users.route.js";
import storesRouter from "./store.route.final.js";
import missionsRouter from "./routes/mission.route.js";
import { handleListStoreReviews } from "./controllers/store.controller.js";

// 환경 변수 로드 (가장 먼저 실행 권장)
dotenv.config();

// BigInt 직렬화 문제 해결 코드
BigInt.prototype.toJSON = function () {
    return this.toString();
};

// 환경 변수에서 PORT 가져오기
const port = process.env.PORT || 3000;

const isLogin = (req, res, next) => {
    // cookie-parser가 만들어준 req.cookies 객체에서 username을 확인
    const { username } = req.cookies;

    if (username) {
        console.log(`[인증 성공] ${username}님, 환영합니다.`);
        next();
    } else {
        console.log('[인증 실패] 로그인이 필요합니다.');
        res.status(401).send('<script>alert("로그인이 필요합니다!");location.href="/login";</script>');
    }
};

// Prisma 연결 테스트 함수
async function testConnection() {
    try {
        await prisma.$connect();
        console.log("Database connection successful using Prisma!");
        return true;
    } catch (error) {
        console.error("Database connection failed:", error.message);
        return false;
    }
}

// 앱 초기화 및 실행 함수
async function initializeApp() {
    // 1. DB 연결 확인
    if (!await testConnection()) {
        console.error("Critical Error: Database connection failed. Shutting down server.");
        process.exit(1);
    }

    try {
        // 2. express 인스턴스 생성
        const app = express();

        // 3. 기본 미들웨어 설정
        app.use(cookieparser());
        app.use(morgan('dev')); // morgan 미들웨어 적용
        app.use(express.static('public'));
        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        // 4. [중요] 공통 응답 헬퍼 함수 등록 (라우터보다 먼저 선언해야 함!)
        app.use((req, res, next) => {
            res.success = (success) => {
                return res.json({ resultType: "SUCCESS", error: null, success });
            };

            res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
                return res.json({
                    resultType: "FAIL",
                    error: { errorCode, reason, data },
                    success: null,
                });
            };

            next();
        });

        // 5. 일반 테스트 및 쿠키 라우트
        app.get('/test', (req, res) => {
            res.send('Hello!');
        });

        app.get('/setcookie', (req, res) => {
            res.cookie('myCookie', 'hello', { maxAge: 60000 });
            res.send('쿠키가 생성되었습니다!');
        });

        app.get('/getcookie', (req, res) => {
            const myCookie = req.cookies.myCookie;
            if (myCookie) {
                console.log(req.cookies);
                res.send(`당신의 쿠키: ${myCookie}`);
            } else {
                res.send('쿠키가 없습니다.');
            }
        });

        app.get('/', (req, res) => {
            res.send(`
                <h1>메인 페이지</h1>
                <p>이 페이지는 로그인이 필요 없습니다.</p>
                <ul>
                    <li><a href="/mypage">마이페이지 (로그인 필요)</a></li>
                </ul>
            `);
        });

        app.get('/login', (req, res) => {
            res.send('<h1>로그인 페이지</h1><p>로그인이 필요한 페이지에서 튕겨나오면 여기로 옵니다.</p>');
        });

        app.get('/mypage', isLogin, (req, res) => {
            res.send(`
                <h1>마이페이지</h1>
                <p>환영합니다, ${req.cookies.username}님!</p>
                <p>이 페이지는 로그인한 사람만 볼 수 있습니다.</p>
            `);
        });

        app.get('/set-login', (req, res) => {
            res.cookie('username', 'UMC9th', { maxAge: 3600000 });
            res.send('로그인 쿠키(username=UMC9th) 생성 완료! <a href="/mypage">마이페이지로 이동</a>');
        });

        app.get('/set-logout', (req, res) => {
            res.clearCookie('username');
            res.send('로그아웃 완료 (쿠키 삭제). <a href="/">메인으로</a>');
        });

        // 6. API 라우트 연결
        // (주의: handleListStoreReviews 내부에서 res.success를 쓴다면 위에서 정의한 미들웨어가 필수입니다)
        app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
        app.use("/api/v1/users", usersRouter);
        app.use("/api/v1/stores", storesRouter);
        app.use("/api/v1/missions", missionsRouter);


        // 7. 전역 에러 핸들러 (반드시 라우트 뒤에 위치)
        app.use((err, req, res, next) => {
            if (res.headersSent) {
                return next(err);
            }

            // 에러 핸들러 통합 (참고하신 코드 스타일)
            res.status(err.statusCode || 500).error({
                errorCode: err.errorCode || "unknown",
                reason: err.reason || err.message || null,
                data: err.data || null,
            });
        });

        // 8. 서버 시작
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });

    } catch (e) {
        console.error("Initialization Error: Failed to load modules or start server.", e);
    }
}

initializeApp();