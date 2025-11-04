export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    nickname: body.nickname,
    password: body.password,
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};


export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = preferences.map(
    (preference) => preference.FoodCategory.name  // FoodCategory로 수정 (대문자 F)
  );
  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};
/*export const responseFromUser = (user, preferences) => {
  return {
    email: user.email,
    name: user.name,
    nickname:user.nickname,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    phoneNumber: user.phoneNumber || user.phone_number,
    preferences: preferences || []
    //password는 응답에서 제외.
  };
};*/