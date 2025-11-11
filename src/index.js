// const express = require('express')  // -> CommonJS
import cors from "cors";
import dotenv from "dotenv";       //.env파일로부터 환경 변수를 읽어들임. 
import express from "express";          // -> ES Module
import { handleUserSignUp, handleListUserReviews, handleListUserMissions } from "./controllers/user.controller.js";
import { handleAddStore } from "./controllers/store.controller.js";
import { handleAddReview } from "./controllers/review.controller.js";
import { handleChallengeMission } from "./controllers/mission.controller.js";
import { handleListStoreReviews, handleListStoreMissions } from "./controllers/store.controller.js";

dotenv.config();     //process.env.객체를 통해 접근하는 동작 

// BigInt 직렬화 설정 추가
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

// 커스텀 응답 메서드 추가
app.use((req, res, next) => {
  res.success = (result) => {
    res.json({
      resultType: "SUCCESS",
      isSuccess: true,
      code: 200,
      message: "success!",
      result
    });
  };
  
  res.error = ({ errorCode = "UNKNOWN", reason, data }) => {
    res.json({
      resultType: "FAIL",
      isSuccess: false,
      code: errorCode,
      message: reason,
      result: data
    });
  };
  
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
//등록 
app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/stores/addStore", handleAddStore);
app.post("/api/v1/reviews/addReview", handleAddReview);
app.post("/api/v1/missions/challenge", handleChallengeMission);
//조회
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews); //가게에 속한 모든 리뷰 조회 
app.get("/api/v1/stores/:storeId/missions",handleListStoreMissions); //특정 가게의 미션 목록 

app.get("/api/v1/users/:userId/reviews", handleListUserReviews); //내가 쓴 모든 리뷰 조회 
app.get("/api/v1/users/:userId/missions",handleListUserMissions); //내가 진행 중인 미션 목록 
//상태 바꾸기 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)  // 백틱과 ${} 사용
})