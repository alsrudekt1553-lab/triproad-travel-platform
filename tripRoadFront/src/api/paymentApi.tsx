import axios from "axios";
import { API_SERVER_HOST } from "./apiConfig"

const prefix = `${API_SERVER_HOST}/api/payment`;

// 결제 준비 — POST /api/payment/ready
// 백이 카카오 ready API 호출 → tid + 리다이렉트 URL 반환
// partnerOrderId는 백이 bookingId 기반 자동 발번 (프론트 송신 X)
export const postReady = async (req: PaymentReadyRequest) => {
  console.log('postReady req->', req);
  const res = await axios.post(`${prefix}/ready`, req);
  console.log('postReady res->', res);
  return res.data as PaymentReadyResponse;
}

// 결제 승인 — POST /api/payment/approve
// successPage가 URL의 pg_token + ready 응답의 tid·partnerOrderId·userId 송신
// 백 처리: 카카오 approve 호출 → PAYMENT.payStatus 500 → BOOKING.status 500 자동 confirm
export const postApprove = async (req: PaymentApproveRequest) => {
  console.log('postApprove req->', req);
  const res = await axios.post(`${prefix}/approve`, req);
  console.log('postApprove res->', res);
  return res.data as PaymentApproveResponse;
}

// 결제 단건 조회 — GET /api/payment/{bookingId}
// successPage에서 결제 완료 정보 추가 조회 필요 시 사용
// (현재는 approve 응답에 payStatus·approvedAt 포함되어 round-trip 불필요)
export const getPaymentByBookingId = async (bookingId: number) => {
  console.log('getPaymentByBookingId bookingId->', bookingId);
  const res = await axios.get(`${prefix}/${bookingId}`);
  console.log('getPaymentByBookingId res->', res);
  return res.data as PaymentInfo;
}

// 회원별 결제 내역 — GET /api/payment/user/{userId}
// 마이페이지용, 승인일 최신순 (백 findByUserIdOrderByApprovedAtDesc)
export const getPaymentsByUser = async (userId: number) => {
  console.log('getPaymentsByUser userId->', userId);
  const res = await axios.get(`${prefix}/user/${userId}`);
  console.log('getPaymentsByUser res->', res);
  return res.data as PaymentInfo[];
}

// 결제 취소 — DELETE /api/payment/cancel/{bookingId}
// cancelPage 진입 시 호출 → PAYMENT 삭제 + BOOKING 해제
// 멱등 동작 — 이미 삭제된 경우도 200 응답 (백에서 ifPresent로 처리)
//
// 처리 범위:
//   - PAYMENT.READY(100)만 → CANCELLED(900) (소프트 삭제)
//   - BOOKING.HOLD(100)만 → CANCELLED(900) (소프트 삭제)
//   - 적립금 환원 (멱등성 보장)
// APPROVED 결제는 처리 안 함 → postRefund 사용
export const deleteCancel = async (bookingId: number) => {
  console.log('deleteCancel bookingId->', bookingId);
  const res = await axios.delete(`${prefix}/cancel/${bookingId}`);
  console.log('deleteCancel res->', res);
  return res.data;
}

// 결제 환불 — POST /api/payment/refund/{bookingId}
// 호출처: 마이페이지 "환불 신청" 버튼 (Layer 5)
//
// APPROVED(500) 상태 결제건의 환불 처리
//   백 처리:
//     1. 카카오 cancel API 호출 (TC0ONETIME 시뮬레이션 — 실 카드사 환불은 정식 CID 전환 후)
//     2. Payment.cancel() — APPROVED → CANCELLED(900) (소프트 삭제)
//     3. Booking.cancel() — CONFIRMED → CANCELLED(900) (소프트 삭제)
//     4. 적립금 환원 (만료 ledger 자동 스킵 + 운영자 보상은 CS 워크플로우)
//
// 멱등성: 이미 CANCELLED면 백이 silent return
//
// 예외 처리 (백 응답 메시지 그대로 노출):
//   - 결제 정보 없음          → 400 "결제 정보 없음: bookingId=..."
//   - APPROVED 상태 아님       → 400 "APPROVED 상태가 아닌 결제는 환불할 수 없습니다"
//   - 카카오 API 실패          → 400 "카카오페이 환불 실패: ..." (전체 트랜잭션 롤백)
//
// body 없음 (path variable만 사용) — axios.post 두 번째 인자 null 명시
export const postRefund = async (bookingId: number) => {
  console.log('postRefund bookingId->', bookingId);
  const res = await axios.post(`${prefix}/refund/${bookingId}`, null);
  console.log('postRefund res->', res);
  return res.data;
}