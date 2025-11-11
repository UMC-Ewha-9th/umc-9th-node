import { prisma } from "../db.config.js";

//////////////////////외래키 검증 함수////////////////////////////////

// 미션 존재 확인 (mission_id)
export const checkMissionExists = async (missionId) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      select: { id: true }
    });
    return mission !== null;
  } catch (err) {
    throw new Error(`미션 조회 실패: ${err.message}`);
  }
};

// 사용자 존재 확인 (user_id)
export const checkUserExists = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });
    return user !== null;
  } catch (err) {
    throw new Error(`사용자 조회 실패: ${err.message}`);
  }
};

/////////////////////////////////////////////
// 미션 조회 (mission_id)
export const getMission = async (missionId) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });
    return mission; // null이면 null 반환
  } catch (err) {
    throw new Error(`미션 조회 실패: ${err.message}`);
  }
};

/////////////////////////////////////////////
// 이미 도전 중인 미션인지 확인
export const checkMissionInProgress = async (userId, missionId) => {
  try {
    const myMission = await prisma.myMission.findFirst({
      where: {
        userId: userId,
        missionId: missionId,
        status: {
          in: ['PENDING', 'IN_PROGRESS']
        }
      },
      select: { id: true }
    });
    return myMission !== null;
  } catch (err) {
    throw new Error(`미션 도전 여부 확인 실패: ${err.message}`);
  }
};

// 내 미션에 추가 (미션 도전하기)
export const addMyMission = async (data) => {
  try {
    const myMission = await prisma.myMission.create({
      data: {
        userId: data.userId,
        missionId: data.missionId,
        storeId: data.storeId,
        regionId: data.regionId,
        status: 'IN_PROGRESS',
        missionDetail: data.missionDetail,
        startedAt: new Date()
      }
    });
    return myMission.id;
  } catch (err) {
    throw new Error(`미션 도전 추가 실패: ${err.message}`);
  }
};

// 내 미션 ID로 조회
export const getMyMission = async (myMissionId) => {
  try {
    const myMission = await prisma.myMission.findUnique({
      where: { id: myMissionId }
    });
    return myMission; // null이면 null 반환
  } catch (err) {
    throw new Error(`내 미션 조회 실패: ${err.message}`);
  }
};