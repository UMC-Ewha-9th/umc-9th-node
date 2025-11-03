// 클라이언트가 보낸 body를 내부 로직에 맞게 파싱
export const bodyToStore = (body) => {
    return {
      name: body.name,                     // 필수
      address: body.address,               // 필수
      latitude: parseFloat(body.latitude), // 숫자 타입 변환
      longitude: parseFloat(body.longitude),
      category: body.category,             // 필수
    };
  };
  
  // DB에 저장된 결과를 응답 형태로 변환
  export const responseFromStore = (store) => {
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      latitude: store.latitude,
      longitude: store.longitude,
      category: store.category,
    };
  };
  