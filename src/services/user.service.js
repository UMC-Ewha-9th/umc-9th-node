import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    password: hashedPassword,//해싱된 비밀번호 저장 
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    phoneNumber: data.phoneNumber,
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

// 로그인 기능 추가 
export const userLogin = async (email, password) => {
  // 1. 이메일로 사용자 조회
  const user = await getUserByEmail(email);
  
  if (!user) {
    throw new Error("존재하지 않는 사용자입니다.");
  }
  
  // 2. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }
  
  // 3. 로그인 성공 처리
  return responseFromUser({ user, preferences: [] });
};