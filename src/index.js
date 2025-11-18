// const express = require('express')  // -> CommonJS
import cors from "cors";
import dotenv from "dotenv";       //.env파일로부터 환경 변수를 읽어들임. 
import express from "express";        // -> ES Module
import cookieParser from "cookie-parser"; // 쿠키를 해석 
import { handleUserSignUp, handleListUserReviews, handleListUserMissions } from "./controllers/user.controller.js";
import { handleAddStore, handleListStoreReviews, handleListStoreMissions } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import { handleChallengeMission } from "./controllers/mission.controller.js";
import morgan from 'morgan'; //요청 기록 

dotenv.config();     //process.env.객체를 통해 접근하는 동작 

// BigInt 직렬화 설정 추가
BigInt.prototype.toJSON = function () {
  return this.toString();
};

//express
const app = express();
const port = process.env.PORT;

// ✨ 미들웨어들은 라우트보다 먼저 등록해야 합니다
app.use(morgan('dev'));  // 로그 포맷: dev
app.use(cors());                            // cors 방식 허용
app.use(cookieParser());                    // cookie-parser 추가
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 커스텀 응답 메서드 추가
/**
 * 공통 응답을 사용할 수 있는 헬퍼 함수 등록
 */
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

// 라우트들
app.get('/test', (req, res) => {
  res.send('Hello!');
});

// 쿠키 만드는 라우터 
app.get('/setcookie', (req, res) => {
  // 'myCookie'라는 이름으로 'hello' 값을 가진 쿠키를 생성
  res.cookie('myCookie', 'hello', { maxAge: 60000 }); // 60초간 유효
  res.send('쿠키가 생성되었습니다!');
});

// 쿠키 읽는 라우터 
app.get('/getcookie', (req, res) => {
  // cookie-parser 덕분에 req.cookies 객체에서 바로 꺼내 쓸 수 있음
  const myCookie = req.cookies.myCookie; 
  if (myCookie) {
    console.log(req.cookies); // { myCookie: 'hello' }
    res.send(`당신의 쿠키: ${myCookie}`); 
  } else {
    res.send('쿠키가 없습니다.');
  }
});

//등록 
app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/stores/addStore", handleAddStore);
app.post("/api/v1/reviews/addReview", handleAddReview);
app.post("/api/v1/missions/challenge", handleChallengeMission);

//조회
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); //가게에 속한 모든 리뷰 조회 
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions); //특정 가게의 미션 목록 
app.get("/api/v1/users/:userId/reviews", handleListUserReviews); //내가 쓴 모든 리뷰 조회 
app.get("/api/v1/users/:userId/missions", handleListUserMissions); //내가 진행 중인 미션 목록 

//상태 바꾸기 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)  
})   

//실습 07-1
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

/**
 * 전역 오류를 처리하기 위한 미들웨어
 */
//✨ 전역 오류 핸들러는 모든 라우트 뒤에 위치해야 한다. 
app.use((err, req, res, next) => {
  // 이미 응답이 시작된 경우 기본 에러 핸들러로 위임
  if (res.headersSent) {
    return next(err);
  }

  // 커스텀 에러인 경우 (statusCode와 errorCode가 있는 경우)
  if (err.statusCode && err.errorCode) {
    console.log(`[커스텀 에러] ${err.errorCode}: ${err.reason}`);
    return res.status(err.statusCode).error({
      errorCode: err.errorCode,
      reason: err.reason,
      data: err.data || null,
    });
  }

  // 예상치 못한 에러인 경우
  console.error("❌ 예상치 못한 에러 발생:", err);
  res.status(500).error({
    errorCode: "INTERNAL_SERVER_ERROR",
    reason: "서버 내부 오류가 발생했습니다.",
    data: null,
  });
});