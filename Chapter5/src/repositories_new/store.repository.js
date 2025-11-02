// store.repository.js

import { pool } from "../db.config.js";

// 가게 데이터 삽입
export const addStore = async (data) => {
  const conn = await pool.getConnection();

  try {
    // region_id, category_id의 유효성 검사 (foreign key)는 DB 레벨에서 처리된다고 가정

    const [result] = await conn.query(
      `INSERT INTO store (region_id, name, address, phone_number, category_id) VALUES (?, ?, ?, ?, ?);`,
      [
        data.regionId,
        data.name,
        data.address,
        data.phoneNumber, // DTO에서 phone_number를 전달한다고 가정
        data.categoryId,
      ]
    );

    // 삽입된 가게의 ID(PK)를 반환
    return result.insertId;
  } catch (err) {
    // 실제 운영 환경에서는 에러를 로깅하고 사용자에게는 일반적인 오류 메시지를 반환
    throw new Error(`[DB Error - addStore]: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 가게 존재 여부 확인
export const getStoreById = async (storeId) => {
    const conn = await pool.getConnection();

    try {
        const [store] = await conn.query(`SELECT id FROM store WHERE id = ?;`, [storeId]);
        
        if (store.length === 0) {
            return null;
        }
        return store[0];
    } catch (err) {
        throw new Error(`[DB Error - getStoreById]: ${err.message}`);
    } finally {
        conn.release();
    }
};

// 리뷰 데이터 삽입
export const addReview = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query(
            `INSERT INTO review (attempt_id, user_id, store_id, rating, content) VALUES (?, ?, ?, ?, ?);`,
            [
                data.attemptId,
                data.userId,
                data.storeId,
                data.rating,
                data.content,
            ]
        );
        return result.insertId;
    } catch (err) {
        // 외래 키 오류 등은 Service 계층에서 구체적인 메시지로 처리
        throw new Error(`[DB Error - addReview]: ${err.message}`);
    } finally {
        conn.release();
    }
};

// 미션 데이터 삽입
export const addMission = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await conn.query(
            `INSERT INTO mission (store_id, min_amount, reward_point, description) VALUES (?, ?, ?, ?);`,
            [
                data.storeId,
                data.minAmount,
                data.rewardPoint,
                data.description,
            ]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(`[DB Error - addMission]: ${err.message}`);
    } finally {
        conn.release();
    }
};