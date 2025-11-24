import { prisma } from "../db.config.js";
import { Decimal } from "@prisma/client/runtime/library.js";

/**
 * 미션 도전 기록을 완료(성공 또는 실패)로 처리하고, 성공 시 포인트 적립을 처리하는 트랜잭션
 * @param {object} data
 * @param {bigint} data.attemptId - 미션 도전 기록 ID
 * @param {bigint} data.userId - 사용자 ID
 * @param {number} data.rewardPoint - 지급할 포인트
 * @param {Decimal} data.spentAmount - 사용자가 미션에 사용한 금액
 * @param {boolean} data.isSuccess - 미션 성공 여부 (minAmount 기준)
 * @returns {object} - 업데이트된 MissionAttempt 기록 (ID만 반환)
 */
export const completeMissionTransaction = async (data) => {
    const { attemptId, userId, rewardPoint, spentAmount, isSuccess } = data;

    // 1. MissionAttempt 상태 및 결제 금액 업데이트
    const updateAttempt = prisma.missionAttempt.update({
        where: { id: attemptId },
        data: {
            status: isSuccess ? 'completed' : 'failed', // 상태 변경 ('completed' 또는 'failed' 가정)
            spentAmount: spentAmount,
            completedAt: new Date(),
        },
        select: { id: true },
    });

    let actions = [updateAttempt];

    // 2. 미션 성공 시 (isSuccess = true) 포인트 적립 및 히스토리 기록
    if (isSuccess) {
        // 2-1. User의 현재 포인트 업데이트
        const updateUserPoints = prisma.user.update({
            where: { id: userId },
            data: {
                currentPoints: {
                    increment: rewardPoint,
                },
            },
        });

        // 2-2. PointHistory 기록 생성
        const createPointHistory = prisma.pointHistory.create({
            data: {
                userId: userId,
                type: 'mission_reward',
                amount: rewardPoint,
                relatedTable: 'mission_attempt',
                relatedId: attemptId,
            },
        });
        
        actions = [...actions, updateUserPoints, createPointHistory];
    }
    
    // 3. 트랜잭션 실행
    await prisma.$transaction(actions);

    return { id: attemptId };
};

/**
 * 특정 미션 도전 기록(attemptId)과 관련 미션, 가게 정보를 조회합니다.
 * @param {bigint} attemptId - 미션 도전 기록 ID
 * @returns {object | null} - MissionAttempt 객체 (Mission, Store 포함)
 */
export const getAttemptDetailsForCompletion = async (attemptId) => {
    try {
        const attempt = await prisma.missionAttempt.findUnique({
            where: { id: attemptId },
            include: {
                mission: {
                    include: {
                        store: {
                            select: { name: true }, // 가게 이름
                        },
                    },
                },
            },
        });
        return attempt;
    } catch (error) {
        console.error("[Prisma Error - getAttemptDetailsForCompletion]:", error);
        throw new Error(`[DB Error]: ${error.message}`);
    }
};

/**
 * 특정 사용자의 진행 중인(pending/requested) 미션 도전 목록을 조회합니다.
 * 만료일(endDate)이 지나지 않은 미션만 필터링합니다.
 * * @param {bigint} userId - 사용자 ID
 * @returns {Array<object>} - 활성 미션 도전(MissionAttempt) 객체 배열
 */
export const getActiveMissionAttemptsByUserId = async (userId) => {
    try {
        const attempts = await prisma.missionAttempt.findMany({
            where: {
                userId: userId,
                // 1. 도전 상태가 'pending' 또는 'requested'인 미션만 선택
                status: {
                    in: ['pending', 'requested'],
                },
                // 2. 미션의 endDate가 현재 시각보다 크거나, endDate가 없는 미션만 선택
                mission: {
                    // OR 조건: (endDate > now()) OR (endDate IS NULL)
                    OR: [
                        { endDate: { gt: new Date() } },
                        { endDate: null },
                    ],
                },
            },
            // MissionAttempt에서 Mission과 Store 정보를 포함하여 가져옵니다.
            include: {
                mission: {
                    select: {
                        id: true,
                        minAmount: true,
                        rewardPoint: true,
                        endDate: true, // 디데이 계산을 위해 필요
                        store: {
                            select: {
                                name: true, // 가게 이름
                            },
                        },
                    },
                },
            },
            orderBy: {
                startedAt: 'asc', // 오래된 도전부터 정렬
            },
        });

        // 🚨 참고: Prisma는 include된 missionAttempt.mission.store.name 형태로 데이터를 반환합니다.
        return attempts;

    } catch (error) {
        console.error("[Prisma Error - getActiveMissionAttemptsByUserId]:", error);
        throw new Error(`[DB Error - getActiveMissionAttemptsByUserId]: ${error.message}`);
    }
};

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
