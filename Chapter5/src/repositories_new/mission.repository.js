// mission.repository.js

import { pool } from "../db.config.js";

// 미션 도전 중복 확인
export const checkMissionChallenge = async (userId, missionId) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query(
            `SELECT id FROM mission_attempt 
             WHERE user_id = ? AND mission_id = ? AND status IN ('pending', 'requested');`,
            [userId, missionId]
        );

        // 도전 기록이 있으면 (ongoing 상태) true 반환
        return result.length > 0;
    } catch (err) {
        throw new Error(`[DB Error - checkMissionChallenge]: ${err.message}`);
    } finally {
        conn.release();
    }
};

// 미션 도전 기록 삽입 (도전 시작)
export const insertMissionAttempt = async (userId, missionId) => {
    const conn = await pool.getConnection();

    try {
        // status는 기본값 'pending'으로 설정
        const [result] = await conn.query(
            `INSERT INTO mission_attempt (user_id, mission_id, status) VALUES (?, ?, 'pending');`,
            [userId, missionId]
        );

        return result.insertId;
    } catch (err) {
        throw new Error(`[DB Error - insertMissionAttempt]: ${err.message}`);
    } finally {
        conn.release();
    }
};