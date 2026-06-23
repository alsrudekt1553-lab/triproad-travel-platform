// src/types/agreement.d.ts
// 백엔드 AgreementDto와 1:1 매핑
// import/export 없이 글로벌 ambient 타입으로 선언


// ─── v1 응답 (현재 사용 중) ──────────────────────────

// 현재 유효 약관 응답 한 줄 — GET /api/agreement/current
// 호출처: holdComponent 진입 시 약관 박스 채우기
//
// typeCode (NUMBER(3) — STATUS_TYPE bcode=400):
//   100 회원가입 약관
//   200 거래/결제 약관
//   300 상품/일정 약관
//   400 운영/사후 약관
//
// isRequired:
//   1 = 필수 (미체크 시 결제 버튼 비활성)
//   0 = 선택
//   ※ 백 응답값은 "일정 오버라이드 > 상품 매핑 > 약관 기본값" 우선순위 적용된 최종값
//
// 정렬: 백이 typeCode ASC 정렬해 응답
//        프론트는 그 순서 그대로 노출 (임의 정렬 금지)
//
// content: CLOB — [내용보기] 모달용 (full text)
interface AgreementInfo {
  agreementId: number
  typeCode: 100 | 200 | 300 | 400
  version: string
  title: string
  content: string
  isRequired: 0 | 1
  effectiveFrom: string
}


// ─── v2 자리 — 사용처 없음, 인터페이스만 마련 ────────────
// 백 AgreementDto에 자리가 마련돼 있으므로 프론트도 정합 유지 차원에서 자리 확보
// 백 Service 메서드(withdrawAgreement / getAgreementsByBookingId)는 v2 미구현
// API endpoint도 v2 백 AgreementController에 추가 필요 (현재 /current 1개만 존재)


// 동의 요청 단건 — 백 AgreementDto.ConsentRequest 매칭
// v2 호출처: 마케팅 약관 사후 동의 / 단건 동의 저장 API
//   예) 마이페이지 "마케팅 수신 동의" 버튼 클릭 시
//       회원가입 후 별도 동의 받는 흐름
//
// IP/User-Agent는 서버에서 HttpServletRequest로 추출 — DTO에 포함 X
// (클라이언트 변조 위험 차단, 분쟁 시 법적 증빙 자료 정합 유지)
interface AgreementConsentRequest {
  agreementId: number
}


// 동의 저장 후 응답 — 백 AgreementDto.ConsentResponse 매칭
// v2 호출처: 마이페이지 "이 예약에서 동의한 약관" 조회 / 동의 단건 저장 후 응답
//   - UserAgreementRepository.findByBookingId 조회 결과 + AgreementType join
//   - 약관명·버전을 함께 응답해 UI에서 "개인정보 수집·이용 v1.0" 등 라벨링
//
// userAgreementId — DB 컬럼명·엔티티 PK 통일 (BOOKING_AGREEMENT → USER_AGREEMENT 리네임)
// version — 동의한 시점의 약관 버전 보존 (전자상거래법 입증)
interface AgreementConsentResponse {
  userAgreementId: number
  bookingId: number
  agreementId: number
  typeCode: 100 | 200 | 300 | 400
  title: string
  version: string
  agreedAt: string
}