import { prisma } from "../db.config.js";

/**
 * 새 가게를 데이터베이스에 삽입합니다. (addStore)
 * @param {object} data - 가게 데이터 객체 (regionId, name, address, phoneNumber, categoryId)
 * @returns {number} 생성된 가게의 ID
 */
export const addStore = async (data) => {
    try {
        // 1. Prisma를 사용하여 store 레코드 생성
        // Prisma는 카멜케이스(JS)와 스네이크케이스(DB)를 자동으로 매핑합니다.
        const createdStore = await prisma.store.create({
            data: {
                // 외래 키 연결을 위해 Id를 직접 할당합니다.
                regionId: data.regionId,
                categoryId: data.categoryId,

                name: data.name,
                address: data.address,
                phoneNumber: data.phoneNumber,

                // created_at, updated_at 등은 스키마에 따라 default 값이 자동 할당됩니다.
            },
            // 생성된 레코드의 ID만 반환하도록 선택
            select: {
                id: true
            }
        });

        // BigInt 또는 Int 타입의 ID를 반환합니다.
        return createdStore.id;
    } catch (error) {
        // Foreign Key 제약 조건 위반 오류 등은 여기서 처리되지만,
        // 일반적으로 Service 계층에서 PrismaClientKnownRequestError를 확인하여 처리합니다.
        console.error("[Prisma Error - addStore]:", error);
        throw new Error(`[DB Error - addStore]: ${error.message}`);
    }
};

/**
 * 가게 존재 여부 확인 (getStoreById)
 * @param {number} storeId - 가게 ID
 * @returns {object | null} 가게 객체 (ID만 포함) 또는 null
 */
export const getStoreById = async (storeId) => {
    try {
        // findUnique를 사용하여 storeId에 해당하는 레코드를 찾습니다.
        const store = await prisma.store.findUnique({
            where: {
                id: storeId // PK(ID)를 기준으로 조회
            },
            // SQL 쿼리 'SELECT id'와 동일하게 ID 필드만 조회하여 성능 최적화
            select: {
                id: true
            }
        });

        // 레코드가 없으면 null 반환
        return store; // (null 또는 { id: number } 반환)
    } catch (error) {
        console.error("[Prisma Error - getStoreById]:", error);
        throw new Error(`[DB Error - getStoreById]: ${error.message}`);
    }
};

/**
 * 리뷰 데이터 삽입 (addReview)
 * @param {object} data - 리뷰 데이터 객체 (attemptId, userId, storeId, rating, content)
 * @returns {number} 생성된 리뷰의 ID
 */
export const addReview = async (data) => {
    try {
        const createdReview = await prisma.review.create({
            data: {
                // 외래 키 연결 필드
                attemptId: data.attemptId, // MissionAttempt.id 참조
                userId: data.userId,       // User.id 참조
                storeId: data.storeId,     // Store.id 참조

                rating: data.rating,
                content: data.content,
            },
            select: {
                id: true
            }
        });

        return createdReview.id;
    } catch (error) {
        console.error("[Prisma Error - addReview]:", error);
        throw new Error(`[DB Error - addReview]: ${error.message}`);
    }
};

/**
 * 미션 데이터 삽입 (addMission)
 * @param {object} data - 미션 데이터 객체 (storeId, minAmount, rewardPoint, description)
 * @returns {number} 생성된 미션의 ID
 */
export const addMission = async (data) => {
    try {
        const createdMission = await prisma.mission.create({
            data: {
                storeId: data.storeId, // Store.id 참조
                minAmount: data.minAmount,
                rewardPoint: data.rewardPoint,
                description: data.description,
            },
            select: {
                id: true
            }
        });

        return createdMission.id;
    } catch (error) {
        console.error("[Prisma Error - addMission]:", error);
        throw new Error(`[DB Error - addMission]: ${error.message}`);
    }
};

/**
 * 특정 가게의 리뷰 목록을 커서 기반으로 조회합니다. (getAllStoreReviews)
 * @param {number} storeId - 가게 ID
 * @param {number | null} cursor - 다음 페이지의 시작점이 되는 마지막 리뷰의 ID (없으면 최신 리뷰부터)
 * @param {number} size - 페이지당 가져올 리뷰 개수 (N + 1개를 가져와 다음 페이지 여부를 확인)
 * @returns {Array<object>} - 리뷰 객체 배열 (최대 size + 1개)
 */
export const getAllStoreReviews = async (storeId, cursor, size) => {
    try {
        // 커서가 있으면 해당 ID보다 작은(lt) 리뷰를, 없으면 전체를 조회합니다.
        // 'desc' 정렬이므로 'lt'를 사용해야 이전 페이지의 마지막 항목보다 오래된 항목을 가져옵니다.
        const reviews = await prisma.review.findMany({
            where: {
                storeId: storeId,
                // 1. 커서 조건: 커서가 있으면 해당 ID보다 작은(lt) 리뷰만 조회
                ...(cursor && { id: { lt: cursor } }),
            },
            select: {
                id: true,
                content: true,
                rating: true,
                createdAt: true,
                storeId: true,
                userId: true,
                // 리뷰 작성자 정보 (이름)
                user: {
                    select: {
                        name: true,
                    },
                },
                // 가게 정보 (이름, 주소)
                store: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
            },
            // 최신 리뷰가 먼저 오도록 내림차순 정렬
            orderBy: {
                id: 'desc',
            },
            // 2. take 옵션을 이용한 개수 제한: size + 1개를 가져와 다음 페이지 여부를 확인
            take: size + 1,
        });

        return reviews; // 최대 size + 1개 반환
    } catch (error) {
        console.error("[Prisma Error - getAllStoreReviews]:", error);
        throw new Error(`[DB Error - getAllStoreReviews]: ${error.message}`);
    }
};
