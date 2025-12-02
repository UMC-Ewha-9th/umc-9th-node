// user.dto.js

export const bodyToUser = (body) => {
  // birth는 string 그대로 유지하는 것이 DB 처리에 유리
  // body.birth가 'YYYY-MM-DD' 형태의 문자열로 들어온다고 가정

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth: new Date(body.birth), // 필수 (DB에 Date/Datetime으로 저장)
    address: body.address || null, // 선택, 빈 문자열보다 null이 DB에 더 명확
    detailAddress: body.detailAddress || null, // 선택
    phoneNumber: body.phoneNumber, // 필수
    preferences: body.preferences, // 필수 (카테고리 ID 배열)
    password: body.password, //필수
  };
};