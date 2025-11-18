import { prisma } from "../db.config.js";

/**
 * 새 사용자를 데이터베이스에 삽입합니다. (기존 addUser 함수)
 * 삽입 전, 이메일 중복을 확인합니다.
 * @param {object} data - 사용자 데이터 객체 (email, name, gender, password 등)
 * @returns {bigint | null} 생성된 사용자의 ID (BigInt) 또는 중복 시 null
 */
export const addUser = async (data) => {
  try {
    // 1. 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    });

    if (existingUser) {
      return null;
    }

    // 2. 사용자 데이터 삽입 (create)
    const createdUser = await prisma.user.create({ 
      data: {
        email: data.email,
        name: data.name,
        gender: data.gender,
        birth: data.birth,
        password: data.password,
        phoneNumber: data.phoneNumber,
        address: data.address,
        detailAddress: data.detailAddress,
      },
      select: { id: true }
    });

    return createdUser.id;
    
  } catch (error) {
    console.error("Error creating user with Prisma:", error);
    throw new Error(`사용자 생성 중 데이터베이스 오류: ${error.message}`);
  }
};


/**
 * 사용자 정보 얻기 (getUser)
 * @param {bigint} userId - 사용자 ID
 * @returns {object | null} 사용자 객체 또는 null
 */
export const getUser = async (userId) => {
  // conn/pool 관련 코드 모두 제거

  try {
    // findUniqueOrThrow: 고유 필드(id)로 하나의 레코드를 찾습니다.
    // 만약 userId에 해당하는 레코드가 없으면 null이 아니라 에러를 던집니다. (findUnique 대비 안전)
    const user = await prisma.user.findUnique({
      where: { 
        id: userId // BigInt 타입으로 처리됨
      }
      // select를 지정하지 않으면 모든 필드를 가져옵니다.
    });

    if (!user) {
      // 레코드가 없으면 null 반환
      return null;
    }

    return user; // Prisma는 결과를 배열이 아닌 객체로 바로 반환
  } catch (error) {
    console.error("Error getting user with Prisma:", error);
    // Prisma.queryRaw, PrismaClientKnownRequestError 등 특정 에러 처리 가능
    throw new Error(`사용자 정보 조회 중 데이터베이스 오류: ${error.message}`);
  }
};


/**
 * 음식 선호 카테고리 매핑 (setPreference)
 * UserFavorCategory 모델을 사용하여 관계 설정
 * @param {bigint} userId - 사용자 ID
 * @param {number} categoryId - 카테고리 ID
 * @returns {void}
 */
export const setPreference = async (userId, categoryId) => {
  // conn/pool 관련 코드 모두 제거

  try {
    // UserFavorCategory (연결 테이블)에 레코드 생성
    await prisma.userFavorCategory.create({
      data: {
        userId: userId,
        categoryId: categoryId,
        // selectedAt은 default(now())이므로 명시적으로 넣을 필요 없음
      }
    });

    return;
  } catch (error) {
    // 만약 이미 복합키가 존재하는 경우(PK 충돌) 등 Prisma 에러 처리
    console.error("Error setting user preference with Prisma:", error);
    // Prisma ClientKnownRequestError: P2002 (Unique constraint failed) 등을 별도 처리 가능
    throw new Error(`선호 카테고리 설정 중 데이터베이스 오류: ${error.message}`);
  }
};


/**
 * 사용자 선호 카테고리 반환 (getUserPreferencesByUserId)
 * JOIN 쿼리 대신 Prisma의 관계 필드(include)를 사용
 * @param {bigint} userId - 사용자 ID
 * @returns {array} 선호 카테고리 목록 (UserFavorCategory 배열)
 */
export const getUserPreferencesByUserId = async (userId) => {
  // conn/pool 관련 코드 모두 제거

  try {
    // UserFavorCategory 모델을 쿼리하여 해당 userId의 모든 레코드를 가져옵니다.
    const preferences = await prisma.userFavorCategory.findMany({
      where: {
        userId: userId,
      },
      // JOIN 쿼리 (category 테이블)를 대체합니다.
      include: {
        category: {
          select: {
            name: true // 카테고리 이름만 가져옴 (c.name 대체)
          }
        }
      },
      orderBy: {
        categoryId: 'asc' // ORDER BY ufc.category_id ASC 대체
      }
    });

    // 반환 형식: [{ userId: 1, categoryId: 1, selectedAt: Date, category: { name: '카페' } }, ...]
    return preferences; 

  } catch (error) {
    console.error("Error getting user preferences with Prisma:", error);
    throw new Error(`선호 카테고리 조회 중 데이터베이스 오류: ${error.message}`);
  }
};