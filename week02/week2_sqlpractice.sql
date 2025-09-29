-- 미션 모아보기
SELECT
    mm.status,
    m.reward,
    s.name,
    m.mission_spec
FROM member_mission mm
         JOIN mission m ON mm.mission_id = m.id
         JOIN store s ON m.store_id = s.id
WHERE mm.member_id = 1
ORDER BY mm.updated_at DESC
LIMIT 10 OFFSET 0;

-- 리뷰 작성
INSERT INTO review (
    id,
    member_id,
    store_id,
    body,
    score,
    created_at,
    updated_at
)
VALUES (
           1,
           1234,
           5678,
           '음 너무 맛있어요 포인트도 얻고 맛있는 맛집도 알게 된 것 같아 너무나도 행복한 식사였습니다. 다음에 또 올게요!!',
           5.0,
           NOW(),
           NOW()
       );

-- 홈 화면
SELECT
    m.id AS mission_id,
    s.name AS store_name,
    fc.name AS food_category,
    m.mission_spec,
    m.reward,
    DATEDIFF(m.deadline, NOW()) AS days_left
FROM mission m
         JOIN store s ON m.store_id = s.id
         JOIN region r ON s.region_id = r.id
         JOIN store_category sc ON s.id = sc.store_id
         JOIN food_category fc ON sc.category_id = fc.id
WHERE r.name = '안암동'
  AND fc.name = '중식'
  AND m.deadline > NOW()
ORDER BY m.deadline ASC
LIMIT 10 OFFSET 0;

-- 마이페이지
SELECT
    name AS nickname,
    email,
    phone_number,
    CASE
        WHEN is_phone_verified = TRUE THEN '인증완료'
        ELSE '미인증'
        END AS phone_status,
    point
FROM member
WHERE id = ?;