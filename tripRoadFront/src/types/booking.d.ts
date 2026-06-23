// src/types/booking.d.ts
// 백엔드 BookingDto와 1:1 매핑
// import/export 없이 글로벌 ambient 타입으로 선언


// ─── 요청 ──────────────────────────────────────────

// 예약 선점 요청 (사용자 → 백)
// POST /api/booking/hold
//
// 추가 필드 5종 (Layer 5 진행 — 백 BookingDto.HoldRequest와 정합):
//   reserverName    예약자 이름
//   reserverPhone   예약자 연락처
//   reserverEmail   예약자 이메일
//   pointUsed       사용할 적립금 (0 가능)
//   agreementIds    동의한 약관 ID list (필수 약관 누락 시 백이 400 반환)
interface BookingHoldRequest {
  userId: number
  scheduleId: number
  headcount: number
  reserverName: string
  reserverPhone: string
  reserverEmail: string
  pointUsed: number
  agreementIds: number[]
}


// ─── 응답 ──────────────────────────────────────────

// 예약 선점 응답 결과 (백 → 사용자)
// POST /api/booking/hold
//
// 추가 필드 4종 (Layer 5 진행):
//   reserverName / reserverPhone / reserverEmail / pointUsed
interface BookingHoldResponse {
  bookingId: number
  userId: number
  scheduleId: number
  headcount: number
  totalPrice: number
  discountAmount: number
  finalPrice: number
  status: number
  holdAt: string
  createdAt: string
  reserverName: string
  reserverPhone: string
  reserverEmail: string
  pointUsed: number
}


// 예약 확정 응답 결과
// PUT /api/booking/confirm/{bookingId}
interface BookingConfirmResponse {
  bookingId: number
  status: number       // 500 = CONFIRM (예약완료)
  updatedAt: string
}


// 예약 상세 - 마이페이지 조회용 항목 (InfoResponse)
// GET /api/booking/user/{userId} 응답 배열의 원소
//
// 추가 필드 4종 (Layer 5 진행):
//   reserverName / reserverPhone / reserverEmail / pointUsed
interface BookingInfo {
  bookingId: number
  userId: number
  scheduleId: number
  headcount: number
  totalPrice: number
  discountAmount: number
  finalPrice: number
  status: number
  holdAt: string
  createdAt: string
  updatedAt: string
  reserverName: string
  reserverPhone: string
  reserverEmail: string
  pointUsed: number
}


// 예약 화면 진입 시 일정 정보 + 잔여 인원
// GET /api/booking/schedule/{scheduleId}
interface BookingScheduleView {
  scheduleId: number
  productName: string
  unitPrice: number
  startDate: string       // LocalDate → ISO yyyy-MM-dd
  endDate: string
  maxHeadcount: number
  remainingCount: number
}