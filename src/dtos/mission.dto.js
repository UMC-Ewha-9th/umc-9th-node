// 요청 body를 MyMission 객체로 변환
export const bodyToMission = (body) => {
  return {
    storeId: body.storeId,
    regionId: body.regionId,
    reward: body.reward,
    dDay: body.dDay,
    missionDetail: body.missionDetail
  };
};

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

export const responseFromMissions = (missions) => {
  return {
    data: missions.map(mission => ({
      id: mission.id.toString(),
      storeId: mission.storeId,
      regionId: mission.regionId,
      reward: mission.reward,
      dDay: mission.dDay,
      missionDetail: mission.missionDetail,
      createdAt: mission.createdAt
    })),
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id.toString() : null
    }
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
// DB 결과를 응답 형태로 변환 (MyMission)
export const responseFromMyMissions = (myMissions) => {
  return {
    data: myMissions.map(mission => ({
      id: myMission.id.toString(),
      userId: myMission.user_id,
      missionId: myMission.mission_id,
      storeId: myMission.store_id,
      regionId: myMission.region_id,
      status: myMission.status,
      missionCount: myMission.mission_count,
      missionDetail: myMission.mission_detail,
      createdAt: myMission.created_at,
      startedAt: myMission.started_at
    })),
    pagination: {
      cursor: missions.length ? myMissions[myMissions.length - 1].id.toString() : null
    }
  };
};

