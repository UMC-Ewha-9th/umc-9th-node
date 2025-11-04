import { pool } from "../db.config.js";

// 해당 storeId가 실제로 존재하는지 확인
export const findStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM stores WHERE id = ?;", [storeId]);
    return rows[0]; // undefined or store
  } finally {
    conn.release();
  }
};

// 리뷰를 DB에 저장
export const insertReview = async (reviewDto) => {
  const conn = await pool.getConnection();
  try {
    const { storeId, userId, rating, content } = reviewDto;

    const [result] = await conn.query(
      `INSERT INTO reviews (store_id, user_id, rating, content)
       VALUES (?, ?, ?, ?)`,
      [storeId, userId, rating, content]
    );

    // 방금 저장한 리뷰 다시 조회해서 응답에 사용
    const [saved] = await conn.query(
      `SELECT * FROM reviews WHERE id = ?`,
      [result.insertId]
    );

    return saved[0];
  } finally {
    conn.release();
  }
};
