import { pool } from "../db.config.js";
import { prisma } from "../db.config.js";
// User 데이터 삽입
/*export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) as isExistEmail;`,
      [data.email]
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    const [result] = await pool.query(
      `INSERT INTO user (email, name, nickname, password, gender, birth, address, phone_num) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.nickname,
        data.password, //해싱된 비밀번호 
        data.gender,
        data.birth,
        data.address,
        data.phoneNumber,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};*/
//addUser 개선
export const addUser = async (data) => {
  const user = await prisma.user.findFirst({ where: { email: data.email } });
  if (user) {
    return null;
  }

  const created = await prisma.user.create({ data: data });
  return created.id;
};



// 사용자 정보 얻기
/*export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, userId);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};*/
export const getUser = async (userId) => {
  const user = await prisma.user.findFirstOrThrow({ where: { id: userId } });
  return user;
};

// 음식 선호 카테고리 매핑
/*export const setPreference = async (userId, foodCategoryId) => {
  const conn = await pool.getConnection();

  try {
    await pool.query(
      `INSERT INTO prefer_food (food_category_id, user_id) VALUES (?, ?);`,
      [foodCategoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};*/
export const setPreference = async (userId, foodCategoryId) => {
  await prisma.preferFood.create({  // userFavorCategory → preferFood
    data: {
      userId: userId,
      foodCategoryId: foodCategoryId,
    },
  });
};

// 사용자 선호 카테고리 반환
/*export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await pool.query(
      "SELECT pf.id, pf.food_category_id, pf.user_id, fc.name " +
        "FROM prefer_food pf JOIN food_category fc on pf.food_category_id = fc.id " +
        "WHERE pf.user_id = ? ORDER BY pf.food_category_id ASC;",
      userId
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};*/
export const getUserPreferencesByUserId = async (userId) => {
  const preferences = await prisma.preferFood.findMany({  // userFavorCategory → preferFood
    select: {
      id: true,
      userId: true,
      foodCategoryId: true,
      FoodCategory: true,  // foodCategory → FoodCategory (관계 이름은 대문자로 시작)
    },
    where: { userId: userId },
    orderBy: { foodCategoryId: "asc" },
  });
  return preferences;
};

//로그인용 사용자 조회
export const getUserByEmail = async (email) => {
  const conn = await pool.getConnection();

  try {
    const [users] = await pool.query(
      `SELECT * FROM user WHERE email = ?;`, 
      [email]
    );

    if (users.length === 0) {
      return null;
    }

    return users[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};