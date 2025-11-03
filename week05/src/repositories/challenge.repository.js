import { pool } from "../db.config.js";

// 사용자 존재 여부 확인
export const findUserById = async (userId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM user WHERE id = ?", [userId]);
    return rows[0];
  } finally {
    conn.release();
  }
};

// 미션 존재 여부 확인
export const findMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query("SELECT * FROM missions WHERE id = ?", [missionId]);
    return rows[0];
  } finally {
    conn.release();
  }
};

// 이미 도전했는지 확인
export const hasUserChallenged = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ?",
      [userId, missionId]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};

// 도전 기록 추가
export const insertChallenge = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO user_mission (user_id, mission_id) VALUES (?, ?)`,
      [userId, missionId]
    );

    const [rows] = await conn.query(
      `SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ?`,
      [userId, missionId]
    );

    return rows[0];
  } finally {
    conn.release();
  }
};
