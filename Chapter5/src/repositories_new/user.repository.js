// user.repository.js

import { pool } from "../db.config.js";

// User 데이터 삽입
export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    // [수정 1] user 테이블에 백틱(\`) 적용 (중복 확인)
    const [confirm] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM \`user\` WHERE email = ?) as isExistEmail;`,
      [data.email]
    );

    if (confirm[0].isExistEmail) {
      return null;
    }

    // [수정 2] user 테이블에 백틱(\`) 적용 (삽입 쿼리)
    const [result] = await conn.query(
      `INSERT INTO \`user\` (email, name, gender, birth, address, detail_address, phone_number, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.name,
        data.gender,
        data.birth,
        data.address,
        data.detailAddress,
        data.phoneNumber,
        data.password,
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
};

// 사용자 정보 얻기
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    // [수정 3] user 테이블에 백틱(\`) 적용 및 user[0] 반환
    const [user] = await conn.query(`SELECT * FROM \`user\` WHERE id = ?;`, [userId]);

    console.log(user);

    if (user.length == 0) {
      return null;
    }

    return user[0]; // 배열의 첫 번째 요소만 반환
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 음식 선호 카테고리 매핑
export const setPreference = async (userId, categoryId) => {
  const conn = await pool.getConnection();

  try {
    // [오타 수정 1] user_favor_category -> user_preferred_category
    await conn.query(
      `INSERT INTO user_preferred_category (category_id, user_id) VALUES (?, ?);`,
      [categoryId, userId]
    );

    return;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [preferences] = await conn.query(
      "SELECT ufc.category_id, ufc.user_id, c.name " +
      "FROM user_preferred_category ufc JOIN category c on ufc.category_id = c.id " +
      "WHERE ufc.user_id = ? ORDER BY ufc.category_id ASC;",
      [userId]
    );

    return preferences;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
