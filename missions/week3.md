### 회원가입하기

- 기능: 회원가입

| **API Endpoint** | `POST/users` |
| --- | --- |
| **HTTP Method** | `POST` |

**Request Body:**


    { 
    	"name": "백소영",
    	"gender": "Female",
    	"brith_date": "20040816",
    	"address": "대한민국 서울",
    	"email": "email@gmail.com",
    	"phone_number": "010-0000-0000",
    }

---
### 홈화면

- 홈화면 초기 데이터 조회

| **API Endpoint** | `GET/home` |
| --- | --- |
| **HTTP Method** | `GET` |
| **Query String** | ?regionId={regionId}&page={page}&size={size} |
---

### 마이페이지: 리뷰 작성

| **API Endpoint** | `POST /stores/{storeId}/food-reviews` |
| --- | --- |
| **HTTP Method** | `POST` |

**Request Body:**

    { 
    	"content": "음 너무 맛있어요 포인트도 얻고...", 
    	"rating": 4.5, 
    	"image_urls": ["/uploads/img_a.jpg", "/uploads/img_b.jpg"] 
    }

---
### 미션목록 조회: 진행중, 진행완료

| **API Endpoint** | `GET /users/my-missions` |
| --- | --- |
| **HTTP Method** | `GET` |
| **Query String** | ?status={status}&page={page}&size={size} |
---
### 미션 성공 누르기

| **API Endpoint** | `POST /user-missions/{userMissionId}/complete` |
| --- | --- |
| **HTTP Method** | `POST` |

**Request Body:**

    { 
    	"status": "COMPLETED",
      "completed_at": "2025-09-28 22:49:00"
    }

