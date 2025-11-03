// const express = require('express')  // -> CommonJS
import cors from "cors";
import dotenv from "dotenv";       //.env파일로부터 환경 변수를 읽어들임. 
import express from "express";          // -> ES Module
import { handleUserSignUp } from "./controllers/user.controller.js";

dotenv.config();     //process.env.객체를 통해 접근하는 동작 

const app = express();
const port = process.env.PORT;

app.use(cors());                            // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post("/api/v1/users/signup", handleUserSignUp);

// stores 엔드포인트 추가
app.post("/api/v1/stores/addStore", (req, res) => {
    const { regionId, storeCategoryId, name, address } = req.body;
    
    // 여기에 스토어 추가 로직 구현
    console.log("받은 데이터:", req.body);
    
    res.status(200).json({
        success: true,
        message: "Store added successfully",
        data: req.body
    });
});

// reviews 엔드포인트 추가
app.post("/api/v1/stores/addReview", (req, res) => {
    const { storeId, userId, score, contents } = req.body;
    
    // 여기에 스토어 추가 로직 구현
    console.log("받은 데이터:", req.body);
    
    res.status(200).json({
        success: true,
        message: "Review added successfully",
        data: req.body
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)  // 백틱과 ${} 사용
})