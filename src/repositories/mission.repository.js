import { pool } from "../db.config.js";

//////////////////////외래키 검증 함수////////////////////////////////

//미션 존재 확인 (mission_id)
export const checkMissionExists = async(missionId) => {
    const conn = await pool.getConnection();

    try{
        const [missions] = await conn.query(
            'SELECT id FROM mission WHERE id =?',
            [missionId]
        );
        return missions.length>0;
    } catch(err){
        throw new Error('미션 조회 실패: ${err.message}');
    } finally{
        conn.release();
    }

};

//사용자 존재 확인 (user_id)
export const checkUserExists = async(userId) => {
    const conn = await pool.getConnection();

    try{
        const [users] = await conn.query(
            'SELECT id FROM user WHERE id =?',
            [userId]
        );
        return users.length>0;
    } catch(err){
        throw new Error('사용자 조회 실패: ${err.message}');
    } finally{
        conn.release();
    }

};

/////////////////////////////////////////////
//미션 조회 (mission_id)
export const getMission = async(missionId) => {
    const conn = await pool.getConnection();

    try{
        const [missions] = await conn.query(
            'SELECT id FROM mission WHERE id =?',
            [missionId]
        );
        return missions.length>0;
    } catch(err){
        throw new Error('미션 조회 실패: ${err.message}');
    } finally{
        conn.release();
    }

};

/////////////////////////////////////////////
//이미 도전 중인 미션인지 확인 
export const checkMissionInProgress = async (userId, missionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [myMissions] = await conn.query(
      `SELECT id FROM my_mission 
       WHERE user_id = ? AND mission_id = ? 
       AND status IN ('PENDING', 'IN_PROGRESS')`,
      [userId, missionId]
    );
    
    return myMissions.length > 0;
  } catch (err) {
    throw new Error(`미션 도전 여부 확인 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};
// 내 미션에 추가 (미션 도전하기)
export const addMyMission = async (data) => {
  const conn = await pool.getConnection();
  
  try {
    const [result] = await conn.query(
      `INSERT INTO my_mission 
       (user_id, mission_id, store_id, region_id, status, mission_detail, started_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        data.userId,
        data.missionId,
        data.storeId,
        data.regionId,
        'IN_PROGRESS',
        data.missionDetail
      ]
    );
    
    return result.insertId;
  } catch (err) {
    throw new Error(`미션 도전 추가 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 내 미션 ID로 조회
export const getMyMission = async (myMissionId) => {
  const conn = await pool.getConnection();
  
  try {
    const [myMissions] = await conn.query(
      `SELECT * FROM my_mission WHERE id = ?`,
      [myMissionId]
    );
    
    if (myMissions.length === 0) {
      return null;
    }
    
    return myMissions[0];
  } catch (err) {
    throw new Error(`내 미션 조회 실패: ${err.message}`);
  } finally {
    conn.release();
  }
};
