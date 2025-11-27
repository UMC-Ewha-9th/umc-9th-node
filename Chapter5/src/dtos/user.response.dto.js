// user.response.dto.js

/**
 * Service에서 받아온 사용자 정보와 선호 카테고리 리스트를 
 * 클라이언트에게 반환할 응답 형식으로 변환합니다.
 * * @param {object} data - Service로부터 받은 { user, preferences } 객체
 * @param {object} data.user - 사용자 기본 정보 (DB 결과)
 * @param {Array<string>} data.preferences - 사용자의 선호 카테고리 리스트
 * @returns {object} 클라이언트에게 전달할 최종 사용자 응답 DTO
 */

export const responseFromUser = ({ user, preferences }) => {
    // preferences 배열에서 각 항목의 category.name (카테고리 이름)만 추출합니다.
    const preferFoods = preferences.map(
        (preference) => preference.category.name 
    );

    return {
        // --- 필수 사용자 정보 ---
        // user 객체에서 직접 접근
        userId: user.id,
        email: user.email,
        name: user.name,
        gender: user.gender,
        birth: user.birth,  // new Date(data.birth),
        phoneNumber: user.phoneNumber,

        // --- 선택 정보 (DB에 NULL 허용 필드) ---
        // Prisma에서 null로 가져온 경우에도 명시적으로 포함 (없으면 null)
        address: user.address || null,
        detailAddress: user.detailAddress || null,

        // --- 선호 카테고리 리스트 ---
        preferCategory: preferFoods, // 필드 이름 통일
    };
};

/**
 * Repository에서 받아온 '내가 작성한' 리뷰 목록을 클라이언트에게 반환할 응답 형식으로 변환합니다.
 * @param {Array<object>} reviews - Repository로부터 받은 리뷰 객체 배열 
 * @returns {Array<object>} 클라이언트에게 전달할 최종 리뷰 응답 DTO 배열
 */
export const responseFromMyReviews = (reviews) => {
    return reviews.map(review => {
        // TODO: 사장님 답글(ReviewReply) 모델이 추가되면 여기에 로직을 추가해야 합니다.
        const ownerReply = review.reviewReply; // 가상의 ReviewReply 관계를 가정
        
        return {
            review_id: review.id,
            store_name: review.store.name, // 가게 이름
            rating: review.rating,
            content: review.content,
            created_at: review.createdAt,
            
            // 사용자 정보 (자신이 작성했으므로 이름 확인용)
            user_id: review.userId,
            user_name: review.user.name, 

            // 사장님 답글 (현재 스키마에 없으므로 임시 데이터 구조만 잡음)
            owner_reply: ownerReply ? {
                content: ownerReply.content,
                replied_at: ownerReply.createdAt,
            } : null,
        };
    });
};