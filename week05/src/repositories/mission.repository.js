import { pool } from "../db.config.js";

// 해당 store가 실제 존재하는지 확인
export const findStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM stores WHERE id = ?;",
      [storeId]
    );
    return rows[0]; // 있으면 객체, 없으면 undefined
  } finally {
    conn.release();
  }
};

// 새로운 미션을 DB에 삽입
export const insertMission = async (missionDto) => {
  const conn = await pool.getConnection();
  try {
    const { storeId, title, description, reward } = missionDto;

    const [result] = await conn.query(
      `INSERT INTO missions (store_id, title, description, reward)
       VALUES (?, ?, ?, ?)`,
      [storeId, title, description, reward]
    );

    const [saved] = await conn.query(
      `SELECT * FROM missions WHERE id = ?`,
      [result.insertId]
    );

    return saved[0];
  } finally {
    conn.release();
  }
};
