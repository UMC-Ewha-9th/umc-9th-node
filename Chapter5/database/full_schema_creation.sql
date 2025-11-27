-- 1. 데이터베이스 생성 (처음 한 번만 실행)
CREATE DATABASE IF NOT EXISTS umc_mission_db;

-- 2. 생성한 데이터베이스를 사용하겠다고 선언
USE umc_mission_db;

-- -------------------------------------------------------------------
-- 전체 DB 스키마 생성 쿼리 (12개 테이블)
-- Datagrip에서 실행하여 테이블 구조를 생성합니다.
-- -------------------------------------------------------------------

-- 사용하려는 데이터베이스 선택 (Datagrip에서 이미 연결되어 있다면 생략 가능)
-- USE [여기에 생성한 DB 이름 입력];

-- 테이블 생성 순서: 관계가 없는 테이블부터, 외래 키가 필요한 테이블 순서로 생성합니다.

-- ---------------------------------
-- 1. Region (지역)
-- ---------------------------------
CREATE TABLE region (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '지역 ID',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '지역 이름 (예: 강남구)'
) COMMENT '지역 정보';

-- ---------------------------------
-- 2. Category (카테고리)
-- ---------------------------------
CREATE TABLE category (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '카테고리 ID',
    name VARCHAR(100) NOT NULL UNIQUE COMMENT '카테고리 이름 (예: 카페, 음식점)'
) COMMENT '가게 카테고리 정보';

-- ---------------------------------
-- 3. User (사용자)
-- ---------------------------------
CREATE TABLE `user` (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '사용자 ID',
    name VARCHAR(100) NOT NULL COMMENT '이름',
    gender VARCHAR(10) NOT NULL COMMENT '성별 (male/female/other)',
    address VARCHAR(255) COMMENT '주소',
    current_points INT DEFAULT 0 COMMENT '현재 보유 포인트 (int: 10자리수)',
    status VARCHAR(20) DEFAULT 'active' COMMENT '상태 (active/inactive)',
    inactive_date DATETIME COMMENT '비활성화 시각',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일시'
) COMMENT '회원 기본 정보';

-- ---------------------------------
-- 4. Store (가게)
-- ---------------------------------
CREATE TABLE store (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '가게 ID',
    region_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL COMMENT '가게 이름',
    address VARCHAR(255) NOT NULL COMMENT '가게 주소',
    phone_number VARCHAR(20) COMMENT '전화번호',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    FOREIGN KEY (region_id) REFERENCES region(id),
    FOREIGN KEY (category_id) REFERENCES category(id)
) COMMENT '가게 기본 정보';

-- ---------------------------------
-- 5. UserPreferredCategory (사용자 선호 카테고리)
-- ---------------------------------
CREATE TABLE user_preferred_category (
    user_id BIGINT NOT NULL,
    category_id INT NOT NULL,
    selected_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '선택 시각',
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
) COMMENT '회원의 선호 카테고리';

-- ---------------------------------
-- 6. Mission (미션)
-- ---------------------------------
CREATE TABLE mission (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '미션 ID',
    store_id BIGINT NOT NULL,
    min_amount DECIMAL(10, 2) NOT NULL COMMENT '최소 결제 금액 (정밀한 계산을 위해 DECIMAL 사용)',
    description TEXT NOT NULL COMMENT '미션 설명',
    is_active TINYINT(1) DEFAULT 1 COMMENT '활성 여부 (0:비활성, 1:활성)',
    start_date DATE NOT NULL COMMENT '시작일',
    end_date DATE NOT NULL COMMENT '종료일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
) COMMENT '미션 상세 정보';

-- ---------------------------------
-- 7. MissionAttempt (미션 도전 기록)
-- ---------------------------------
CREATE TABLE mission_attempt (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '도전 ID',
    user_id BIGINT NOT NULL,
    mission_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL COMMENT '상태 (pending, requested, completed 등)',
    auth_code VARCHAR(10) COMMENT '인증번호',
    spent_amount DECIMAL(10, 2) COMMENT '실제 결제 금액',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '도전 시작 시각',
    request_at DATETIME COMMENT '성공 요청 시각',
    approved_at DATETIME COMMENT '승인 시각',
    completed_at DATETIME COMMENT '완료 시각',
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (mission_id) REFERENCES mission(id) ON DELETE CASCADE
) COMMENT '회원의 미션 도전 상태';


-- ---------------------------------
-- 8. Review (리뷰)
-- ---------------------------------
CREATE TABLE review (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '리뷰 ID',
    attempt_id BIGINT NOT NULL UNIQUE, -- 미션 도전 기록당 하나의 리뷰
    user_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5) COMMENT '평점 (1~5, tinyint: 3자리수)',
    content TEXT COMMENT '리뷰 내용',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '작성일시',
    FOREIGN KEY (attempt_id) REFERENCES mission_attempt(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
) COMMENT '미션 성공 후 리뷰 기록';


-- ---------------------------------
-- 9. Visit (방문 기록)
-- ---------------------------------
CREATE TABLE visit (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '방문 ID',
    user_id BIGINT NOT NULL,
    store_id BIGINT NOT NULL,
    attempt_id BIGINT UNIQUE COMMENT '관련 미션 도전 ID (선택 사항)',
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '방문 시각',
    spent_amount DECIMAL(10, 2) NOT NULL COMMENT '결제 금액',
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE,
    FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE,
    FOREIGN KEY (attempt_id) REFERENCES mission_attempt(id) ON DELETE SET NULL
) COMMENT '회원의 가게 방문 및 결제 기록';


-- ---------------------------------
-- 10. PointHistory (포인트 내역)
-- ---------------------------------
CREATE TABLE point_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '포인트 내역 ID',
    user_id BIGINT NOT NULL,
    type VARCHAR(30) NOT NULL COMMENT '포인트 유형 (mission_reward, visit_reward 등)',
    amount INT NOT NULL COMMENT '포인트 양',
    related_table VARCHAR(50) COMMENT '관련 테이블명 (visit, mission_attempt 등)',
    related_id BIGINT COMMENT '관련 레코드 ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '적립/차감 일시',
    FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE
) COMMENT '포인트 적립/차감 상세 내역';


-- ---------------------------------
-- 11. RegionReward (지역 보상 조건)
-- ---------------------------------
CREATE TABLE region_reward (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '보상 ID',
    region_id INT NOT NULL,
    required_store_count INT NOT NULL COMMENT '요구 방문 가게 수 (예: 10)',
    reward_points INT NOT NULL COMMENT '보상 포인트 (예: 1000)',
    is_active TINYINT(1) DEFAULT 1 COMMENT '활성 여부',
    start_date DATE NOT NULL COMMENT '시작일',
    end_date DATE NOT NULL COMMENT '종료일',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '생성일시',
    FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE
) COMMENT '지역별 미션 보상 조건';

-- ---------------------------------
-- 12. 테이블 인덱스 추가 (조회 성능 향상)
-- ---------------------------------

-- 자주 WHERE 조건에 사용되는 컬럼에 인덱스 추가
CREATE INDEX idx_user_status ON `user` (status);
CREATE INDEX idx_mission_store_active ON mission (store_id, is_active);
CREATE INDEX idx_mission_attempt_user_status ON mission_attempt (user_id, status);
CREATE INDEX idx_visit_user_store ON visit (user_id, store_id);
CREATE INDEX idx_review_user_store ON review (user_id, store_id);
