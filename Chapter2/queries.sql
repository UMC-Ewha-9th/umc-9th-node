SET @user_id  = 1;            -- 회원 PK
SET @cursor   = 999999999;    -- 첫 페이지면 큰 값, 다음 페이지부터는 마지막 m.id보다 작게
SET @region   = 'Seoul';      -- 지역 이름
SET @attempt_id = 1;          -- 리뷰에 사용할 mission_attempt PK
SET @store_id   = 1;          -- 리뷰에 사용할 가게 PK
SET @rating     = 5;          -- 1~5
SET @content    = '맛있고 친절했어요!';  -- 리뷰 내용

-- 1) 특정 회원의 진행중(=pending) 미션 목록
SELECT m.id AS mission_id, s.name AS store_name, m.description, ma.status
FROM `user` u
JOIN mission_attempt ma ON u.id = ma.user_id
JOIN mission m ON m.id = ma.mission_id
JOIN store s ON m.store_id = s.id
WHERE u.id = @user_id
  AND ma.status = 'pending'
  AND m.id < @cursor
ORDER BY m.id DESC
LIMIT 10;

-- 2) 특정 회원의 완료(completed) 미션 목록
SELECT m.id AS mission_id, s.name AS store_name, m.description, ma.status
FROM `user` u
JOIN mission_attempt ma ON u.id = ma.user_id
JOIN mission m ON m.id = ma.mission_id
JOIN store s ON m.store_id = s.id
WHERE u.id = @user_id
  AND ma.status = 'completed'
  AND m.id < @cursor
ORDER BY m.id DESC
LIMIT 10;

-- 3) 리뷰 등록 (FK 제약 충족: @attempt_id/@user_id/@store_id가 실제 존재해야 함)
INSERT INTO review (attempt_id, user_id, store_id, rating, content, created_at)
VALUES (@attempt_id, @user_id, @store_id, @rating, @content, NOW());

-- 4) 홈: 선택 지역에서 '아직 내가 도전하지 않은' 진행 중 미션 (페이징)
SELECT m.id,
       s.name AS store_name,
       m.description,
       DATEDIFF(m.end_date, NOW()) AS days_left
FROM mission m
JOIN store s  ON m.store_id = s.id
JOIN region r ON r.id = s.region_id
WHERE r.name = @region
  AND m.end_date > NOW()
  AND m.id < @cursor
  AND NOT EXISTS (
        SELECT 1
        FROM mission_attempt ma
        WHERE ma.user_id = @user_id
          AND ma.mission_id = m.id
      )
ORDER BY m.id DESC
LIMIT 10;

-- 5) 마이페이지: 회원 기본 정보
SELECT id, name, gender, address, current_points
FROM `user`
WHERE id = @user_id;