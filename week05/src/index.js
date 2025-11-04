import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { handleUserSignUp } from "./controllers/user.controller.js";
import { handleStoreCreate } from './controllers/store.controller.js';
import { handleCreateReview } from "./controllers/review.controller.js";
import { handleCreateMission} from "./controllers/mission.controller.js";
import { handleChallengeMission } from "./controllers/challenge.controller.js";


dotenv.config(); // 환경변수 불러와서 저장 

const app = express(); // 서버 인스턴스 생성 
const port = process.env.PORT;

app.use(cors()); // CORS 허용 
app.use(express.static("public")); // public 폴더의 정적 파일 접근 가능하게 함 
app.use(express.json()); // 클라이언트가 JSON 형식의 데이터를 보낼 경우 파싱해서 사용할 수 있게 함 
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get("/", (req, res) => {
  res.send("Hello World!");
}); // 테스트

app.post("/api/v1/users/signup", handleUserSignUp); // 클라이언트가 해당 요청 보내면 해당 함수 실행됨 
app.post("/api/v1/stores", handleStoreCreate);
app.post("/api/v1/stores/:storeId/reviews", handleCreateReview);
app.post("/api/v1/stores/:storeId/missions", handleCreateMission);
app.post("/api/v1/users/:userId/missions/:missionId/challenge", handleChallengeMission);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); // 지정된 포트에서 서버 실행함 