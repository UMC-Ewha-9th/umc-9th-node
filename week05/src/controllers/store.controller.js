import { StatusCodes } from "http-status-codes"; // 상태 코드 상수
import { bodyToStore } from "../dtos/store.dto.js"; // body를 DTO로 변환하는 함수
import { createStore } from "../services/store.service.js"; // 실제 저장 로직을 담당하는 서비스 함수

// 클라이언트의 가게 등록 요청을 처리
export const handleStoreCreate = async (req, res, next) => {
  console.log("가게 등록 요청이 들어왔습니다!");
  console.log("body:", req.body); // 들어온 데이터 확인용

  try {
    const storeDto = bodyToStore(req.body); // 요청 데이터를 내부 로직용 DTO로 변환
    const store = await createStore(storeDto); // 실제 가게 등록

    return res.status(StatusCodes.CREATED).json({ result: store }); 
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.message || "가게 등록 중 오류 발생" });
  }
};
