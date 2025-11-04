import bcrypt from "bcrypt";
import {
  addUser,
  getUser,
  setPreference,
  getUserPreferencesByUserId,
} from "../repositories/user.repository.js";

import { responseFromUser } from "../dtos/user.dto.js";

export const userSignUp = async (data) => {
  // 1. 평문 비밀번호 해싱 
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 2. 저장할 사용자 객체 생성 (암호화된 비밀번호 사용)
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    password: hashedPassword, // 해싱된 비밀번호 저장
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  // 3. 선호 카테고리 저장
  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  // 4. 저장된 사용자/선호 데이터 가져오기
  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};
