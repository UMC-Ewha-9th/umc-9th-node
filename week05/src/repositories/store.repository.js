// repositories/store.repository.js
import { pool } from "../db.config.js";

// name + address 조합으로 기존에 존재하는 가게가 있는지 확인
export const findStoreByNameAndAddress = async (name, address) => {
  const conn = await pool.getConnection(); // 커넥션 하나 꺼내옴
  try {
    const [rows] = await conn.query(
      "SELECT * FROM stores WHERE name = ? AND address = ?;",
      [name, address] // ?에 값 바인딩
    );
    return rows[0]; // 결과 배열의 첫 번째 요소 리턴 (없으면 undefined)
  } finally {
    conn.release(); // 커넥션 반납
  }
};

// 실제로 store를 INSERT 하는 쿼리 실행
export const insertStore = async (storeData) => {
  const conn = await pool.getConnection();
  try {
    const { name, address, latitude, longitude, category } = storeData;

    const [result] = await conn.query(
      `INSERT INTO stores (name, address, latitude, longitude, category)
       VALUES (?, ?, ?, ?, ?)`,
      [name, address, latitude, longitude, category]
    );

    // insertId: DB가 자동 생성한 primary key 반환
    return {
      id: result.insertId,
      ...storeData, // 입력한 정보 그대로 담아 반환
    };
  } finally {
    conn.release();
  }
};
