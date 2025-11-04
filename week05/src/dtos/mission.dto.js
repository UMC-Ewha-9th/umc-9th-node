// 클라이언트 body + storeId → 내부 로직용 mission 객체로 변환
export const bodyToMission = (body, storeId) => {
    return {
      storeId: parseInt(storeId),          // URL에서 받은 storeId
      title: body.title,                   // 미션 제목
      description: body.description || "", // 미션 설명 (선택)
      reward: parseInt(body.reward),       // 보상 (숫자)
    };
  };
  
  // DB에서 insert한 결과 → 응답 포맷으로 변환
  export const responseFromMission = (mission) => {
    return {
      id: mission.id,
      storeId: mission.store_id,
      title: mission.title,
      description: mission.description,
      reward: mission.reward,
      createdAt: mission.created_at,
    };
  };
  