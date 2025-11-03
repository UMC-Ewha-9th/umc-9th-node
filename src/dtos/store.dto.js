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