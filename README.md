# TripRoad - 여행 패키지 예약 플랫폼

## 프로젝트 소개

TripRoad는 여행 패키지 예약부터 일정 관리, 마이페이지 기능까지 제공하는 여행 예약 플랫폼입니다.

사용자는 여행 상품을 예약하고 예약 내역을 확인할 수 있으며,
여행 일정에 맞춘 체크리스트 작성, 후기 작성, 찜 목록 관리 등 여행 전후의 편의 기능을 제공합니다.

---

## 개발 환경

### Front-End
- React
- TypeScript
- HTML5
- CSS3

### Back-End
- Java
- Spring Boot
- Spring Data JPA

### Database
- Oracle Database

### Tools
- Git / GitHub
- IntelliJ
- VS Code

---

## 담당 기능

### 마이페이지

- 메인 화면
- 예약 내역 조회
- 여행 캘린더
- 체크리스트
- 찜목록
- 나의 후기
- 나의 문의
- 회원정보 수정

담당 화면 코드는

```
tripRoadFront/src/pages/myPage
```

경로에서 확인할 수 있습니다.

---

## 핵심 구현

### 1. 예약 내역 조회 API

- 사용자 ID를 기반으로 예약 목록 조회
- Entity → DTO 변환
- 최신 예약순 정렬

사용 파일

```
MyPageBookingController.java
```

핵심 코드

```java
@GetMapping("/user/{userId}")
public List<BookingDto.InfoResponse> getBookingsByUser(...)
```

---

### 2. 찜목록 토글 기능

- 이미 찜한 상품이면 삭제
- 찜하지 않은 상품이면 등록
- 하나의 API로 추가/삭제 처리

사용 파일

```
MyPageServiceImpl.java
```

핵심 코드

```java
Optional<Wishlist> existing = wishlistRepository.findByMemberIdAndPackageId(...);

if(existing.isPresent()){
    ...
}else{
    ...
}
```

---

### 3. 체크리스트 CRUD

- 체크리스트 생성
- 체크리스트 조회
- 체크리스트 수정
- 체크리스트 삭제

사용 파일

```
ChecklistRepository.java
ChecklistItemRepository.java
MyPageServiceImpl.java
```

---

## 프로젝트 목표

1차 프로젝트에서는 ERP 기능을 구현하며 정해진 요구사항을 정확하게 구현하는 경험을 쌓았습니다.

2차 프로젝트에서는 사용자 중심의 기능을 고민하는 것을 목표로 하였습니다.

예약 상태를 활용한 후기 작성, 여행 날짜를 기준으로 한 캘린더 표시, 여행 준비를 위한 체크리스트 기능 등 실제 사용자의 편의성을 높일 수 있는 기능을 직접 기획하고 구현하였습니다.

---

## 배운 점

- REST API와 React 화면을 연동하는 전체 흐름을 경험할 수 있었습니다.
- JPA를 활용하여 Entity 중심으로 데이터를 관리하는 방법을 익혔습니다.
- 사용자의 입장에서 필요한 기능과 화면 구성을 고민하는 경험을 할 수 있었습니다.
- 하나의 기능을 구현할 때도 화면, API, 데이터베이스가 함께 동작하는 구조를 이해하게 되었습니다.
