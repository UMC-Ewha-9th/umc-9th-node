// 요청 body를 Store 객체로 변환
export const bodyToStore = (body) => {
  return {
    regionId: body.regionId,
    storeCategoryId: body.storeCategoryId,
    name: body.name,
    address: body.address
  };
};

// DB 결과를 응답 형태로 변환
export const responseFromStore = (store) => {
  return {
    id: store.id,
    regionId: store.region_id,
    storeCategoryId: store.store_category_id,
    name: store.name,
    address: store.address,
    isOpen: store.is_open,
    score: store.score,
    createdAt: store.created_at
  };
};

//가게에 대한 모든 리뷰 조회 
export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};
//가게의 모든 미션 조회 
export const responseFromMissions = (missions) => {
  return {
    data: missions,
    pagination: {
      cursor: missions.length ? missions[missions.length - 1].id : null,
    },
  };
};

