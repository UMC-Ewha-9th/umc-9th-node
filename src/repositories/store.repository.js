import { prisma } from "../db.config.js";

//////////////////////외래키 검증 함수////////////////////////////////

// 지역 존재 확인 (region_id)
export const checkRegionExists = async (regionId) => {
  try {
    const region = await prisma.region.findUnique({
      where: { id: regionId },
      select: { id: true }
    });
    return region !== null;
  } catch (err) {
    throw new Error(`지역 조회 실패: ${err.message}`);
  }
};

// 가게 카테고리 존재 확인 (store_category_id)
export const checkStoreCategoryExists = async (storeCategoryId) => {
  try {
    const category = await prisma.storeCategory.findUnique({
      where: { id: storeCategoryId },
      select: { id: true }
    });
    return category !== null;
  } catch (err) {
    throw new Error(`가게 카테고리 조회 실패: ${err.message}`);
  }
};

////////////////////////////가게 추가////////////////////////////////

// Store 데이터 삽입
export const addStore = async (data) => {
  try {
    const store = await prisma.store.create({
      data: {
        regionId: data.regionId,
        storeCategoryId: data.storeCategoryId,
        name: data.name,
        address: data.address
      }
    });
    return store.id;
  } catch (err) {
    throw new Error(`가게 추가 실패. (${err.message})`);
  }
};

// Id로 가게 조회
export const getStore = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId }
    });
    return store; // null이면 null 반환
  } catch (err) {
    throw new Error(`가게 조회 실패: ${err.message}`);
  }
};

// 특정 지역에서 가게 목록 조회
export const getStoresByRegion = async (regionId) => {
  try {
    const stores = await prisma.store.findMany({
      where: { regionId: regionId }
    });
    return stores;
  } catch (err) {
    throw new Error(`가게 목록 조회 실패: ${err.message}`);
  }
};

/////////////////////////////////////////////////////////////

// 가게 존재 여부 확인 (나중에 리뷰/미션 등록시 사용)
export const checkStoreExists = async (storeId) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: { id: true }
    });
    return store !== null;
  } catch (err) {
    throw new Error(`가게 조회 실패: ${err.message}`);
  }
};

///////////////////////////////////////////////////

// 가게에 속한 모든 리뷰 조회 (커서 기반 페이지네이션)
export const getAllStoreReviews = async (storeId, cursor = 0) => {
  console.log('📥 storeId:', storeId, typeof storeId);
  console.log('📥 cursor:', cursor, typeof cursor);
  console.log('📥 cursor is falsy?', !cursor);

  try {
    const whereCondition = {
      storeId: storeId,
      ...(cursor ? { id: { gt: cursor } } : {})
    };

    console.log('🔍 Final where:', JSON.stringify(whereCondition, null, 2));

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
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      where: whereCondition,
      orderBy: { id: "asc" },
      take: 5
    });

    console.log('✅ Returned IDs:', reviews.map(r => r.id));

    return reviews;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  }
};
//가게의 모든 미션 조회 
export const getAllStoreMissions = async (storeId, cursor = 0) => {
  try {
    const whereCondition = {
      storeId: storeId,
      ...(cursor ? { id: { gt: cursor } } : {})
    };

    const missions = await prisma.mission.findMany({
      select: {
        id: true,
        storeId: false,
        regionId: true,
        reward:true,
        dDay:true,
        missionDetail:true,
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

    console.log('Returned IDs:', missions.map(r => r.id));

    return missions;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  }
};