// URL 파라미터를 내부 로직용 DTO로 변환
export const paramsToChallenge = (userId, missionId) => {
    return {
      userId: parseInt(userId),       // 사용자 ID (int)
      missionId: parseInt(missionId), // 미션 ID (int)
    };
  };
  
  // 응답 포맷으로 변환
  export const responseFromChallenge = (row) => {
    return {
      userId: row.user_id,
      missionId: row.mission_id,
      challengedAt: row.created_at,
    };
  };
  