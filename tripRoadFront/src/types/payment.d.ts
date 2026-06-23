// src/types/payment.d.ts
// 백엔드 PaymentDto와 1:1 매핑
// import/export 없이 글로벌 ambient 타입으로 선언


// ─── 요청 ──────────────────────────────────────────

// 결제 준비 요청 (사용자 → 백 → 카카오페이)
// POST /api/payment/ready
// 백이 받아서 카카오 ready API 호출 → tid와 리다이렉트 URL 반환 (백 PaymentServiceImpl이 bookingId를 partnerOrderId로 자동 발번 → 프론트 송신 X)
interface PaymentReadyRequest {
  bookingId: number
  userId: number
  scheduleId: number
  itemName: string          // 카카오 결제창에 표시될 상품명 (BookingScheduleView.productName)
  amount: number            // 결제 금액 (BookingHoldResponse.finalPrice 그대로)
  approvalUrl: string       // 결제 성공 시 돌아올 프론트 URL (successPage)
  cancelUrl: string         // 결제 취소 시 돌아올 프론트 URL (cancelPage)
  failUrl: string           // 결제 실패 시 돌아올 프론트 URL (failPage)
}


// 결제 승인 요청 (카카오페이 콜백 후 → 백)
// POST /api/payment/approve
// successPage가 URL의 pg_token + ready 응답의 tid·partnerOrderId·userId 함께 송신 → 백이 카카오 approve API 호출 → 결제 승인 처리
interface PaymentApproveRequest {
  tid: string               // ready 응답의 tid 그대로
  pgToken: string           // 카카오 콜백 쿼리스트링의 pg_token
  partnerOrderId: number    // ready 응답에서 받은 값을 그대로 반환
  userId: number            // ready 요청에서 받은 값을 그대로 반환 (백이 카카오 approve API 호출할 때도 사용)
}


// ─── 응답 ──────────────────────────────────────────

// 카카오페이 ready 응답 (백 → 프론트)
// POST /api/payment/ready
// PC: nextRedirectPcUrl, 모바일: nextRedirectMobileUrl 이동 시 카카오 결제창 진입
interface PaymentReadyResponse {
  tid: string                     // 카카오페이 거래번호 (PAYMENT.TID, VARCHAR2(30))
  nextRedirectPcUrl: string       // PC 결제창 URL
  nextRedirectMobileUrl: string   // 모바일 결제창 URL
  partnerOrderId: number          // 백이 발번한 주문번호 (approve 송신 시 다시 사용)
}


// 결제 승인 응답
// POST /api/payment/approve
// 백 처리: 카카오 approve 호출 → PAYMENT.payStatus 500 → BOOKING.status 500 (자동 confirm)
interface PaymentApproveResponse {
  paymentId: number
  bookingId: number
  tid: string
  amount: number
  payStatus: number               // 500 (승인 완료) 확실히 들어옴
  approvedAt: string              // LocalDateTime → ISO datetime
}


// 결제 상세 - 마이페이지/단건 조회용 항목 (PaymentDto.Detail과 매핑)
// GET /api/payment/{bookingId}      → 단건 PaymentInfo
// GET /api/payment/user/{userId}    → 배열 PaymentInfo[]
interface PaymentInfo {
  paymentId: number
  bookingId: number
  tid: string
  amount: number
  payStatus: number         // 100 = 미승인, 500 = 승인 완료
  approvedAt: string        // LocalDateTime → ISO datetime
}