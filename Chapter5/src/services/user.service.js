// src\services\user.service.js

import { responseFromUser, responseFromMyReviews } from "../dtos/user.response.dto.js";
import bcrypt from 'bcrypt';
import { getActiveMissionAttemptsByUserId, getAttemptDetailsForCompletion, completeMissionTransaction } from "../repositories_new/mission.repository.js";
import { responseFromActiveMissionAttempts } from "../dtos/mission.dto.js";
import { Decimal } from "@prisma/client/runtime/library.js";
import { DuplicateUserEmailError } from "../errors.js";

import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  findReviewsByUserId,
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
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

/**
 * '내가 작성한' 리뷰 목록을 조회하는 비즈니스 로직
 * @param {bigint} userId - 리뷰를 조회할 사용자 ID
 * @returns {Array<object>} - 포맷된 리뷰 응답 DTO 배열
 */
export const listMyReviews = async (userId) => {
    // 1. [핵심 검증] 사용자 존재 여부 확인
    const user = await getUser(userId);
    if (!user) {
        // U404: Not Found - 사용자가 없으면 리뷰도 조회 불가
        throw new Error("U404: 해당 사용자를 찾을 수 없습니다."); 
    }
    
    // 2. Repository 호출: 사용자 ID로 리뷰 목록 조회
    const reviews = await findReviewsByUserId(userId);

    // 3. 응답 DTO 변환 및 반환
    return responseFromMyReviews(reviews);
};

/**
 * 특정 사용자의 현재 진행 중인 미션 목록을 조회하는 비즈니스 로직
 * @param {bigint} userId - 미션 목록을 조회할 사용자 ID
 * @returns {Array<object>} - 포맷된 진행 중인 미션 응답 DTO 배열
 */
export const listActiveMissions = async (userId) => {
    // 1. [핵심 검증] 사용자 존재 여부 확인
    const user = await getUser(userId);
    if (!user) {
        throw new Error("U404: 해당 사용자를 찾을 수 없습니다.");
    }
    
    // 2. Repository 호출: 활성 미션 도전 목록 조회
    const attempts = await getActiveMissionAttemptsByUserId(userId);

    // 3. 응답 DTO 변환 및 반환
    return responseFromActiveMissionAttempts(attempts);
};

/**
 * 미션 도전을 완료 처리합니다. (성공 여부에 따라 포인트 지급)
 * @param {bigint} userId - 요청한 사용자 ID
 * @param {bigint} attemptId - 미션 도전 기록 ID
 * @param {number} spentAmount - 사용자가 결제한 금액 (미션 성공 여부 판단 기준)
 * @returns {object} - 미션 처리 결과 ({ attemptId, isSuccess, rewardPoint })
 */
export const processMissionCompletion = async (userId, attemptId, spentAmount) => {
    // 1. [핵심 검증] 도전 기록 및 미션 정보 조회
    const attempt = await getAttemptDetailsForCompletion(attemptId);

    if (!attempt || attempt.userId !== userId) {
        throw new Error("M404: 유효하지 않거나 접근 권한이 없는 미션 도전 기록입니다.");
    }

    if (attempt.status !== 'pending' && attempt.status !== 'requested') {
        throw new Error("M409: 이미 완료(completed/failed)된 미션 도전 기록입니다.");
    }
    
    const mission = attempt.mission;
    const minAmount = new Decimal(mission.minAmount);
    const rewardPoint = mission.rewardPoint;

    // 2. 미션 성공 여부 판단
    // spentAmount가 minAmount 이상이면 성공
    const isSuccess = new Decimal(spentAmount).greaterThanOrEqualTo(minAmount);

    // 3. 트랜잭션을 통해 DB 업데이트 및 포인트 처리
    await completeMissionTransaction({
        attemptId: attemptId,
        userId: userId,
        rewardPoint: rewardPoint,
        spentAmount: new Decimal(spentAmount),
        isSuccess: isSuccess,
    });

    return {
        attemptId,
        isSuccess,
        rewardPoint: isSuccess ? rewardPoint : 0,
    };
};