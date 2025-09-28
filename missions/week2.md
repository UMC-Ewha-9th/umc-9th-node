### 1. 미션 페이징

    SELECT
        user_mission.status AS mission_status,        -- 미션 상태 (진행중, 성공 등)
        mission.reward AS reward_point,               -- 미션 보상 포인트
        store.name AS store_name,                     -- 식당 이름
        mission.mission_spec AS mission_description,  -- 미션 설명
        user_mission.created_at                       -- 미션 시작 시점 (정렬 기준)
    FROM
        user_mission
    INNER JOIN
        mission ON user_mission.mission_id = mission.id    -- user_mission 테이블의 mission_id와 mission 테이블의 id 연결
    INNER JOIN
        store ON mission.store_id = store.id               -- mission 테이블의 store_id와 store 테이블의 id 연결
    WHERE
        user_mission.user_id = user_id               -- **[조건]** 로그인한 사용자 ID 필터링
    ORDER BY
        user_mission.created_at DESC                  -- **[정렬]** 최신순 정렬
    LIMIT
        :page_size                                    -- **[페이징]** 한 번에 보여줄 데이터 개수
    OFFSET
        :offset_value;                                -- **[페이징]** 건너뛸 데이터 개수

### 2. 리뷰쿼리

    INSERT INTO food_review (
        user_id,
        store_id,
        content,
        rating,
        created_at
    ) VALUES (
        1000,                                 
        50,                                    
        '너무 맛있어요!',                 
        4.7,                                   
        NOW()      --created_at: 현재 DB 서버 시간
    );

### 3. 홈 화면 쿼리

    SELECT
        Mission.id,
        Mission.reward_point,                       -- 보상 포인트
        Store.name AS store_name,                   -- 가게 이름
        COUNT(UserMission.id) AS user_mission_count, -- 현재 사용자가 미션을 시도한 횟수
        Mission.created_at
    FROM
        Mission
    INNER JOIN
        Store ON Mission.store_id = Store.id        -- 미션과 가게 연결
    INNER JOIN
        Region ON Store.region_id = Region.id       -- 가게와 지역 연결
    LEFT JOIN
        UserMission ON Mission.id = UserMission.mission_id  -- 미션과 사용자 기록 연결
        AND UserMission.user_id = :user_id          
    WHERE
        Region.id = :region_id                     
    GROUP BY
        Mission.id, Mission.reward_point, Store.name, Mission.created_at  
    ORDER BY
        Mission.created_at DESC           -- 최신순 정렬(현재 도전 가능한 미션만 보여주기 위함)
    LIMIT
        :page_size                        -- 한 번에 보여줄 개수
    OFFSET
        :offset_value;                    -- 건너뛸 개수

### 4. 마이페이지 화면 쿼리
    SELECT
        user.id AS user_id,
        user.name,
        user.email,
        user.phone_number,
        user.phone_activate,
        COALESCE(SUM(mission.reward), 0) AS total_point
    FROM
        user
    LEFT JOIN
        user_mission ON user.id = user_mission.user_id AND user_mission.status = '성공' -- 사용자의 성공 미션 기록만 연결
    LEFT JOIN
        mission ON user_mission.mission_id = mission.id                              -- 성공 미션의 reward 정보 가져오기
    WHERE
        user.id = :user_id  -- 현재 로그인한 사용자 ID
    GROUP BY
        user.id, user.name, user.email, user.phone_number, user.phone_activate

  
