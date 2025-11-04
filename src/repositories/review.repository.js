import { pool } from "../db.config.js";

//////////////////////외래키 검증 함수////////////////////////////////
//지역 존재 확인 (region_id)
export const checkRegionExists = async(regionId) => {
  const conn = await pool.getConnection();
  try{
    const [regions] = await conn.query(
      'SELECT id FROM region WHERE id = ?',
      [regionId]
    );
    return regions.length > 0;
  } catch(err){
    throw new Error(`지역 조회 실패: ${err.message}`);
  } finally{
    conn.release();
  }
};

////////////////////////////리뷰 추가////////////////////////////////
// review 데이터 삽입
export const addReview = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO review (store_id, user_id, score, contents) VALUES (?, ?, ?, ?);`,
      [
        data.storeId,
        data.userId,
        data.score,
        data.contents,
      ]
    );
    return result.insertId;
  } catch (err) {
    throw new Error(
      `리뷰 추가 실패. (${err.message})`
    );
  } finally {
    conn.release();
  }
};

////////////////////////////////////////////////////////////////
//특정 가게에서 리뷰 목록 조회 
export const getReviewsByStore = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [reviews] = await conn.query(
      `SELECT * FROM review WHERE store_id = ?`,
      [storeId]
    );
    return reviews;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

//자신이 쓴 리뷰 목록 조회 
export const getReviewsByUser = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [reviews] = await conn.query(
      `SELECT * FROM review WHERE user_id = ?`,
      [userId]
    );
    return reviews;
  } catch (err) {
    throw new Error(`리뷰 목록 조회 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 특정 리뷰 조회 (ID로)
export const getReview = async (reviewId) => {
  const conn = await pool.getConnection();
  try {
    const [reviews] = await conn.query(
      `SELECT * FROM review WHERE id = ?`,
      [reviewId]
    );
    return reviews[0]; // 단일 리뷰 반환
  } catch (err) {
    throw new Error(`리뷰 조회 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};