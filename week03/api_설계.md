
### 1. 회원가입
    
- **Method**: `POST`
- **Endpoint**: `/api/v1/users`
- **Request Body**:
    
```json
    {
      "name": "함하경",
      "gender": "FEMALE",
      "birth_date": "2001-06-21",
      "address": "서울시 마포구",
    }
```
    
### 2. 선호 카테고리 조사
    
- **Method**: `POST`
- **Endpoint**: `/api/v1/users/{userId}/preferences`
- **Path Variable**: `userId`
- **Request Body**:
    
```json
    {
      "food_category_ids": [1, 2, 4]
    }
```
    
### 3. 홈 화면 – 도전 가능한 미션 조회
    
- **Method**: `GET`
- **Endpoint**: `/api/v1/users/{userId}/available-missions`
- **Query String**: `?region=안암동&category=중식`
- **Response 예시**:
    
 ```json
    [
      {
        "mission_id": 11,
        "store_name": "반이학생마라탕",
        "title": "10,000원 이상 결제 시 500P 적립",
        "reward_point": 500,
        "valid_days": 7,
        "image_url": "https://example.com/mara.png"
      }
    ]
    ```
    
### 4. 미션 화면 – 내가 받은 미션 조회
    
- **Method**: `GET`
- **Endpoint**: `/api/v1/users/{userId}/missions`
- **Query String**:
    - `?status=IN_PROGRESS` → 진행중
    - `?status=COMPLETED` → 완료
- **Response 예시**:
    
    ```json
    [
      {
        "user_mission_id": 101,
        "mission_id": 5,
        "store_name": "가게이름 예시",
        "title": "12,000원 이상 결제 시 500P 적립",
        "status": "IN_PROGRESS",
        "started_at": "2025-09-27T12:00:00",
        "reward_point": 500
      }
    ]
    ```
    
### 5. 미션 성공 누르기
    
- **Method**: `PATCH`
- **Endpoint**: `/api/v1/user-missions/{userMissionId}`
- **Path Variable**: `userMissionId`
- **Request Body**:
    
    ```json
    {
      "status": "COMPLETED",
      "completed_at": "2025-09-28T14:30:00"
    }
    ```
    
### 5. 리뷰 작성
    
- **Method**: `POST`
- **Endpoint**: `/api/v1/reviews`
- **Request Body**:
    
    ```json
    {
      "user_id": 1,
      "mission_id": 5,
      "rating": 5,
      "content": "맛있고 친절했어요!",
      "images": [
        "https://example.com/images/123.jpg",
        "https://example.com/images/124.jpg"
      ]
    }
    ```
    