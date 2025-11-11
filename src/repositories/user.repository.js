import { prisma } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  try {
    // 이메일 중복 확인
    const user = await prisma.user.findFirst({ 
      where: { email: data.email } 
    });
    
    if (user) {
      return null; // 이미 존재하는 이메일
    }

    // 사용자 생성
    const created = await prisma.user.create({ 
      data: data 
    });
    
    return created.id;
  } catch (err) {
    throw new Error(`사용자 추가 실패: ${err.message}`);
  }
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: userId } 
    });
    return user; // null이면 null 반환
  } catch (err) {
    throw new Error(`사용자 조회 실패: ${err.message}`);
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, foodCategoryId) => {
  try {
    await prisma.preferFood.create({
      data: {
        userId: userId,
        foodCategoryId: foodCategoryId
      }
    });
  } catch (err) {
    throw new Error(`선호 카테고리 설정 실패: ${err.message}`);
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  try {
    const preferences = await prisma.preferFood.findMany({
      select: {
        id: true,
        userId: true,
        foodCategoryId: true,
        FoodCategory: true // 관계 포함
      },
      where: { userId: userId },
      orderBy: { foodCategoryId: "asc" }
    });
    return preferences;
  } catch (err) {
    throw new Error(`선호 카테고리 조회 실패: ${err.message}`);
  }
};

// 로그인용 사용자 조회 (이메일로)
export const getUserByEmail = async (email) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    return user; // 없으면 null 반환
  } catch (err) {
    throw new Error(`사용자 조회 실패: ${err.message}`);
  }
};

// 내가 작성한 모든 리뷰 조회 (커서 기반 페이지네이션)
export const getAllUserReviews = async (userId, cursor = 0) => {
  try {
    const whereCondition = {
      userId: userId,
      ...(cursor ? { id: { gt: cursor } } : {})
    };

    const reviews = await prisma.review.findMany({
      select: {
        id: true,
        contents: true,
        score: true,
        createdAt: true,
        Store: {
          select: {
            id: true,
            name: true
          }
        }
      },
      where: whereCondition,
      orderBy: { id: "asc" },
      take: 5
    });

    console.log('Returned IDs:', reviews.map(r => r.id));

    return reviews;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  }
};

//내가 진행 중인 미션 조회 
export const getAllUserMissions = async (userId, cursor = 0) => {
  try {
    const whereCondition = {
      userId: userId,
      status:"IN_PROGRESS", //진행 중인 미션만 필터링 
      ...(cursor ? { id: { gt: cursor } } : {})
    };

    const missions = await prisma.myMission.findMany({
      select: {
        id: true,
        userId: true,
        missionId: true,
        storeId: true,
        regionId: true,
        status: true,
        missionCount: true,
        missionDetail: true,
        createdAt: true,
        startedAt: true
      },
      where: whereCondition,
      orderBy: { id: "asc" },
      take: 5
    });

    console.log('Returned IDs:', missions.map(r => r.id));

    return missions;
  } catch (err) {
    throw new Error(`미션 목록 조회 실패: ${err.message}`);
  }
};