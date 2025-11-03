import { pool } from "../db.config.js";

//////////////////////외래키 검증 함수////////////////////////////////

//지역 존재 확인 (region_id)
export const checkRegionExists = async(regionId) => {
    const conn = await pool.getConnection();

    try{
        const [regions] = await conn.query(
            'SELECT id FROM region WHERE id =?',
            [regionId]
        );
        return regions.length>0;
    } catch(err){
        throw new Error('지역 조회 실패: ${err.message}');
    } finally{
        conn.release();
    }

};

//가게 카테고리 존재 확인 (store_category_id)
export const checkStoreCategoryExists =async(storeCategoryId) =>{
    const conn = await pool.getConnetion();
    try{
        const [categories] =await conn.query(
            'SELECT id FROM store_categroy WHERE id=?'
            [storeCategoryId]
        );
        return categories.length>0;
    } catch(err){
        throw new Error('가게 카테고리 조회 실패: ${err.message}');
    } finally{
        conn.release();
    }
};


////////////////////////////가게 추가////////////////////////////////
// Store 데이터 삽입
export const addStore = async (data) => {
  const conn = await pool.getConnection();

  try {
 
    const [result] = await pool.query(
      `INSERT INTO store (region_id, store_category_id, name, address) VALUES (?, ?, ?, ?);`,
      [
        data.regionId,
        data.storeCategoryId,
        data.name,
        data.address,
      ]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `가게 추가 실패. (${err.message})`
    );
  } finally {
    conn.release();
  }
};

// Id로 가게 조회 
export const getStore = async (storeId) => {
  const conn = await pool.getConnection();

  try {
    const [stores] = await pool.query(`SELECT * FROM store WHERE id = ?;`, [storeId]);
    if (stores.length === 0) {
        return null;
        }
        
        return stores[0];
    } catch (err) {
        throw new Error(`가게 조회 실패: ${err.message}`);
    } finally {
        conn.release();
    }
};

//특정 지역에서 가게 목록 조회 
export const getStoresByRegion = async (regionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [stores] = await conn.query(
      `SELECT * FROM store WHERE region_id = ?`,
      [regionId]
    );
    
    return stores;
  } catch (err) {
    throw new Error(`가게 목록 조회 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

/////////////////////////////////////////////////////////////
//가게 존재 여부 확인 (나중에 리뷰/미션 등록시 사용)
export const checkStoreExists =async(storeId) =>{
    const conn = await pool.getConnetion();
    try{
        const [stores] =await conn.query(
            'SELECT id FROM store WHERE id=?'
            [storeId]
        );
        return stores.length>0;
    } catch(err){
        throw new Error('가게 조회 실패: ${err.message}');
    } finally{
        conn.release();
    }
};