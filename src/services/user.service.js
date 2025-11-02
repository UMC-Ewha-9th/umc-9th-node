// src\services\user.service.js

import { responseFromUser } from "../dtos/user.response.dto.js";
import bcrypt from 'bcrypt';

import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories_new/user.repository.js";

// salt rounds 설정. 보안을 위해 최소 10 이상 권장
const saltRounds = 10;

export const userSignUp = async (data) => {
  // 1. 비밀번호 추출 및 해싱 처리
    // DTO에서 password 필드를 받지 않았다고 가정하고, password를 임시로 추가합니다.
    // 실제로는 user.dto.js와 DB 스키마에 password 필드가 있어야 합니다.
    const { email, name, gender, birth, address, detailAddress, phoneNumber, password } = data; // 🚨 password 변수 추가 가정

    // --- [해싱 로직 시작] ---
    // 클라이언트에서 비밀번호를 받았다고 가정하고 해싱 진행
    // (현재 DTO와 DB 스키마에 password가 없으므로, 임시로 data 객체에 password가 있다고 가정합니다.)
    
    // 1-1. 비밀번호가 없으면 오류 처리 (필수 입력값 가정이므로)
    if (!password) {
         throw new Error("B400: 비밀번호는 필수 입력 항목입니다.");
    }
    
    // 1-2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // --- [해싱 로직 끝] ---

  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    // 해싱된 비밀번호를 Repository로 전달
    password: hashedPassword, // 'data.password' 대신 hashedPassword 사용
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};