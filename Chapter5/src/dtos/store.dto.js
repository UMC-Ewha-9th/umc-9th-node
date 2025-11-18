/**
 * 클라이언트의 POST /stores 요청 본문(Body) 데이터를
 * Repository 계층으로 전달하기 위해 정리하는 DTO 함수.
 * @param {object} body - 클라이언트로부터 받은 요청 본문
 * @returns {object} DB 저장을 위한 데이터 객체
 */
export const bodyToStore = (body) => {
    // DB 스키마와 repository 쿼리에 필요한 컬럼만 추출하여 반환합니다.
    return {
        // 필수 값
        regionId: body.regionId,
        categoryId: body.categoryId,
        name: body.name,
        address: body.address,
        phoneNumber: body.phoneNumber || null, // 전화번호는 선택적으로 처리
    };
};