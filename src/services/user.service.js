import { 
  responseFromReviews, 
  responseFromUser, 
  responseFromMyMissions 
} from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  getAllUserReviews,
  getAllUserMissions,
  getUserByEmail
} from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { 
  DuplicateUserEmailError,
  ValidationError,
  UserNotFoundError
} from "../errors.js";

export const userSignUp = async (data) => {
  // 1. 필수 데이터 검증
  if (!data.email || !data.password || !data.name || !data.nickname) {
    throw new ValidationError(
      "필수 데이터가 누락되었습니다.",
      { 
        email: data.email, 
        name: data.name, 
        nickname: data.nickname 
      }
    );
  }

  // 2. 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // 3. 사용자 추가
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    nickname: data.nickname,
    password: hashedPassword,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    phoneNumber: data.phoneNumber,
  });

  // 4. 이메일 중복 체크
  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", { email: data.email });
  }

  // 5. 선호 카테고리 설정
  if (data.preferences && data.preferences.length > 0) {
    for (const preference of data.preferences) {
      await setPreference(joinUserId, preference);
    }
  }

  // 6. 사용자 정보 조회
  const user = await getUser(joinUserId);
  if (!user) {
    throw new UserNotFoundError(
      "회원가입 후 사용자 조회에 실패했습니다.",
      { userId: joinUserId }
    );
  }

  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

// 로그인 기능
export const userLogin = async (email, password) => {
  // 1. 필수 데이터 검증
  if (!email || !password) {
    throw new ValidationError(
      "이메일과 비밀번호를 입력해주세요.",
      { email }
    );
  }

  // 2. 이메일로 사용자 조회
  const user = await getUserByEmail(email);
  
  if (!user) {
    throw new UserNotFoundError(
      "존재하지 않는 사용자입니다.",
      { email }
    );
  }
  
  // 3. 비밀번호 검증
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new ValidationError(
      "비밀번호가 일치하지 않습니다.",
      { email }
    );
  }
  
  // 4. 선호 카테고리 조회
  const preferences = await getUserPreferencesByUserId(user.id);
  
  // 5. 로그인 성공 처리
  return responseFromUser({ user, preferences });
};

// 내가 작성한 모든 리뷰 조회 
export const listUserReviews = async (userId, cursor) => {
  // 1. userId 유효성 검증
  if (!userId || isNaN(userId)) {
    throw new ValidationError(
      "유효하지 않은 사용자 ID입니다.",
      { userId }
    );
  }

  // 2. cursor 유효성 검증
  if (cursor < 0) {
    throw new ValidationError(
      "커서 값은 0 이상이어야 합니다.",
      { cursor }
    );
  }
  
  // 3. 리뷰 목록 조회
  const reviews = await getAllUserReviews(userId, cursor);
  
  // 4. DTO로 변환하여 반환
  return responseFromReviews(reviews);
};

// 내가 진행 중인 모든 미션 조회 
export const listUserMissions = async (userId, cursor) => {
  // 1. userId 유효성 검증
  if (!userId || isNaN(userId)) {
    throw new ValidationError(
      "유효하지 않은 사용자 ID입니다.",
      { userId }
    );
  }

  // 2. cursor 유효성 검증
  if (cursor < 0) {
    throw new ValidationError(
      "커서 값은 0 이상이어야 합니다.",
      { cursor }
    );
  }
  
  // 3. 미션 목록 조회
  const missions = await getAllUserMissions(userId, cursor);
  
  // 4. DTO로 변환하여 반환
  return responseFromMyMissions(missions);
};