// 요청 body를 MyMission 객체로 변환
export const bodyToMyMission = (body) => {
  return {
    userId: body.userId,
    missionId: body.missionId
  };
};

// DB 결과를 응답 형태로 변환 (Mission)
export const responseFromMission = (mission) => {
  return {
    id: mission.id,
    storeId: mission.store_id,
    regionId: mission.region_id,
    reward: mission.reward,
    dDay: mission.d_day,
    missionDetail: mission.mission_detail,
    createdAt: mission.created_at
  };
};

// DB 결과를 응답 형태로 변환 (MyMission)
export const responseFromMyMission = (myMission) => {
  return {
    id: myMission.id,
    userId: myMission.user_id,
    missionId: myMission.mission_id,
    storeId: myMission.store_id,
    regionId: myMission.region_id,
    status: myMission.status,
    missionCount: myMission.mission_count,
    missionDetail: myMission.mission_detail,
    createdAt: myMission.created_at,
    startedAt: myMission.started_at
  };
};