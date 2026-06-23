// src/types/point.d.ts
// 백엔드 UserPointDto + UserPointLedgerDto와 1:1 매핑
// import/export 없이 글로벌 ambient 타입으로 선언


// ─── v1 응답 (현재 사용 중) ──────────────────────────

// 적립금 잔액 응답 — GET /api/point/{userId}
// 호출처: holdComponent 진입 시 "보유 적립금" 표시
// 신규 유저(row 없음)는 백이 pointBalance=0, updatedAt=null로 응답
interface UserPointBalance {
  userId: number
  pointBalance: number
  updatedAt: string | null
}


// 적립금 이력 한 줄 응답 — GET /api/point/{userId}/history
// 호출처: 마이페이지 적립금 이력 list
// 백이 created_at DESC 정렬해 응답 (findByUserIdOrderByCreatedAtDesc)
//
// historyType (NUMBER(3)):
//   100 적립 / 200 차감 / 300 환원 / 400 만료
//
// relatedType (VARCHAR2(20)):
//   BOOKING  → relatedId = bookingId
//   REVIEW   → relatedId = reviewId
//   COUPON   → relatedId = couponId   (v2)
//   ADMIN    → relatedId = adminId    (v2)
//   SYSTEM   → relatedId = null       (스케줄러 자동 만료 등)
//   SIGNUP   → relatedId = userId     (가입 보너스, 시드)
//
// LEDGER 시대 신규 필드 4종 (백 USER_POINT_HISTORY 컬럼 추가분):
//   ledgerId     어느 적립건이 변동했는지 (FIFO 차감 시 1:N row)
//   relatedType  변동 사유 유형
//   relatedId    변동 사유 ID
//   scheduleId   어느 일정의 적립금이었는지 (마이페이지 표시용)
interface UserPointHistory {
  historyId: number
  userId: number
  bookingId: number | null
  ledgerId: number | null
  pointAmount: number
  pointBalanceAfter: number
  historyType: number
  relatedType: string | null
  relatedId: number | null
  scheduleId: number | null
  createdAt: string
}


// ─── v2 자리 — 사용처 없음, 인터페이스만 마련 ────────────
// 백 DTO에 자리가 마련돼 있으므로 프론트도 정합 유지 차원에서 자리 확보
// 실제 호출은 admin 화면 / 마이페이지 LEDGER 화면 도입 시 시작


// 적립금 수동 차감 요청 — 백 UserPointDto.UseRequest 매칭
// v2 호출처: admin 운영자 수동 차감 화면
//   예) 어뷰징 적립금 회수, CS 응대 시 수동 차감
// API endpoint는 v2 백 PointController에 추가 필요 (현재 없음)
interface UserPointUseRequest {
  userId: number
  amount: number
  bookingId: number
}


// 적립금 수동 환원 요청 — 백 UserPointDto.RefundRequest 매칭
// v2 호출처: admin 운영자 수동 환원 화면
//   예) 만료 ledger 스킵된 사용자 보상 (CS 워크플로우)
//       시스템 오류로 잘못 차감된 적립금 복구
// API endpoint는 v2 백 PointController에 추가 필요 (현재 없음)
interface UserPointRefundRequest {
  userId: number
  amount: number
  bookingId: number
}


// 적립금 원장(LEDGER) 단건 상세 — 백 UserPointLedgerDto.Detail 매칭
// v2 호출처: 마이페이지 "내 적립금 상세" — 출처별 카드 UI
//   - 활성 ledger list를 카드로 표시 (예약 적립 / 리뷰 적립 / 가입 보너스 등)
//   - 만료 임박 ledger(expiresAt - now < 7일)는 강조 표시
//
// sourceType (NUMBER(3) — STATUS_TYPE bcode=290):
//   100 예약 적립 / 200 이벤트 / 300 리뷰 적립 / 400 CMS 동의
//   500 관리자 지급 / 600 가입 보너스 / 700 프로모션 / 800 쿠폰
//
// status (NUMBER(3) — STATUS_TYPE bcode=280):
//   100 활성 (FIFO 차감 후보)
//   500 전체 사용 (잔여=0)
//   900 만료
//
// sourceId nullable — TARGET_ALL 시즌 프로모션 등은 null
interface UserPointLedgerDetail {
  ledgerId: number
  userId: number
  pointAmount: number       // 원본 적립액 (불변)
  remainingAmount: number   // 잔여 적립액 (FIFO 차감으로 줄어듦)
  sourceType: number
  sourceId: number | null
  earnedAt: string
  expiresAt: string
  status: number
}


// 출처별 요약 — 백 UserPointLedgerDto.SourceSummary 매칭
// v2 호출처: 마이페이지 카드 UI 헤더
//   예) "예약 적립    12,000P (3건)"
//       "리뷰 적립     5,500P (2건)"
//       "가입 보너스   10,000P (1건)"
//       "만료 임박       800P (1건, D-3)"
interface UserPointSourceSummary {
  sourceType: number
  totalRemaining: number
  ledgerCount: number
}


// 만료 임박 ledger — 백 UserPointLedgerDto.ExpiringSoon 매칭
// v2 호출처:
//   1) PointExpireScheduler 7일 전 알림 발송 대상 추출
//   2) 마이페이지 "만료 임박 적립금" 화면 강조 표시
//
// daysUntilExpire — 백이 expiresAt - now 일 단위 계산해서 응답
interface UserPointExpiringSoon {
  ledgerId: number
  userId: number
  remainingAmount: number
  expiresAt: string
  daysUntilExpire: number
}