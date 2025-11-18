import { prisma } from "../db.config.js";

/**
 * 미션 도전 중복 확인 (checkMissionChallenge)
 * 사용자 ID와 미션 ID를 기준으로 진행 중인 미션(pending/requested)이 있는지 확인합니다.
 * @param {bigint} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {boolean} 진행 중인 도전 기록이 있으면 true, 없으면 false
 */
export const checkMissionChallenge = async (userId, missionId) => {
  try {
    // 1. Prisma의 findFirst를 사용하여 조건을 만족하는 레코드 하나를 찾습니다.
    const attempt = await prisma.missionAttempt.findFirst({
      where: {
        userId: userId,
        missionId: missionId,
        // SQL의 status IN ('pending', 'requested')를 Prisma의 List filter로 대체
        status: {
          in: ['pending', 'requested'],
        },
      },
      // ID만 조회하여 성능을 최적화합니다.
      select: {
        id: true,
      },
    });

    // 레코드가 존재하면 true (도전 중), 존재하지 않으면 false (도전 가능) 반환
    return attempt !== null; 

  } catch (error) {
    console.error("[Prisma Error - checkMissionChallenge]:", error);
    throw new Error(`[DB Error - checkMissionChallenge]: ${error.message}`);
  }
};

/**
 * 미션 도전 기록 삽입 (insertMissionAttempt)
 * @param {bigint} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {number} 생성된 미션 도전 기록의 ID
 */
export const insertMissionAttempt = async (userId, missionId) => {
  try {
    // 1. Prisma의 create를 사용하여 mission_attempt 레코드 삽입
    // status는 모델에 default('pending')이 설정되어 있으므로 명시하지 않아도 됩니다.
    const createdAttempt = await prisma.missionAttempt.create({
      data: {
        userId: userId,
        missionId: missionId,
      },
      select: {
        id: true, // 생성된 ID 반환
      },
    });

    return createdAttempt.id;

  } catch (error) {
    console.error("[Prisma Error - insertMissionAttempt]:", error);
    throw new Error(`[DB Error - insertMissionAttempt]: ${error.message}`);
  }
};
