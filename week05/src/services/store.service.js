import {
    findStoreByNameAndAddress,
    insertStore,
  } from "../repositories/store.repository.js";

  import { responseFromStore } from "../dtos/store.dto.js";

  // 비즈니스 로직을 담당하는 계층
export const createStore = async (data) => {
    // 1. 중복 가게가 있는지 검사
    const duplicate = await findStoreByNameAndAddress(data.name, data.address);
  
    // 2. 있으면 예외 던지기 
    if (duplicate) {
      throw new Error("이미 등록된 가게입니다.");
    }
  
    // 3. 문제 없으면 저장
    const newStore = await insertStore(data);
  
    // 4. 저장 결과를 응답 형태로 포맷
    return responseFromStore(newStore);
  };