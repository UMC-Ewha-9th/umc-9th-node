// user.response.dto.js

/**
 * Service에서 받아온 사용자 정보와 선호 카테고리 리스트를 
 * 클라이언트에게 반환할 응답 형식으로 변환합니다.
 * * @param {object} data - Service로부터 받은 { user, preferences } 객체
 * @param {object} data.user - 사용자 기본 정보 (DB 결과)
 * @param {Array<string>} data.preferences - 사용자의 선호 카테고리 리스트
 * @returns {object} 클라이언트에게 전달할 최종 사용자 응답 DTO
 */
export const responseFromUser = (data) => {
    // 인자로 받은 객체에서 user와 preferences를 구조 분해 할당
    const { user: userData, preferences: preferenceList } = data; 
    
    // 이제 userData와 preferenceList 변수를 사용하여 로직을 처리합니다.

    return {
        // 필수 사용자 정보
        // userData는 user.service.js에서 getUser(joinUserId)의 결과입니다.
        userId: userData.id, 
        email: userData.email,
        name: userData.name,
        gender: userData.gender,
        birth: userData.birth,
        phoneNumber: userData.phoneNumber,

        // 선택 정보 (있는 경우에만 포함)
        address: userData.address || null, 
        detailAddress: userData.detailAddress || null,

        // 선호 카테고리 리스트
        preferences: preferenceList,
    };
};