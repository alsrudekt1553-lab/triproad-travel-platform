import { useState } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { postHold, getScheduleForBooking } from "../../api/bookingApi";
import { postReady } from "../../api/paymentApi";
import { getBalance } from "../../api/pointApi";
import { getCurrentAgreements } from "../../api/agreementApi";
import { getCurrentUserId } from "../../api/user01Api";

// ============================================================
// holdComponent — 예약 + 결제 단일 화면 (UX Plan D)
//
// 진입 경로: /booking/hold/:scheduleId
// 상품 상세에서 navigate state로 productName/unitPrice/departureDate 전달 가능
//   → 없어도 동작 (백 schedule 응답이 동일 정보 제공)
//   → 있으면 로딩 이전 placeholder로 미리 노출
//
// 결제 흐름:
//   1. POST /api/booking/hold    → bookingId, finalPrice
//   2. POST /api/payment/ready   → tid, redirectUrl
//   3. sessionStorage.setItem(`payment_${bookingId}`, ...)
//   4. window.location = redirectUrl (PC/모바일 분기)
// ============================================================

function HoldComponent() {
  const { scheduleId } = useParams();
  const location = useLocation();
  const userId = getCurrentUserId();

  // 상품 상세에서 전달된 state (없어도 동작)
  const locationState = location.state as {
    productName?: string;
    unitPrice?: number;
    departureDate?: string;
  } | null;

  // ── 사용자 입력 state ─────────────────────────────────────
  const [reserverName,  setReserverName]  = useState("");
  const [reserverPhone, setReserverPhone] = useState("");
  const [reserverEmail, setReserverEmail] = useState("");
  const [headcount,     setHeadcount]     = useState(1);
  const [pointUsed,     setPointUsed]     = useState(0);
  const [agreedIds,     setAgreedIds]     = useState<Set<number>>(new Set());
  const [fieldErrors,   setFieldErrors]   = useState<Record<string, string>>({});

  // 약관 내용보기 모달
  const [modalContent, setModalContent] = useState<{ title: string; content: string } | null>(null);

  // ── TanStack useQuery × 3 병렬 ───────────────────────────

  // 1) 일정 + 잔여 인원
  const {
    data: schedule,
    isLoading: scheduleLoading,
    error: scheduleError,
  } = useQuery({
    queryKey: ["booking-schedule", scheduleId],
    queryFn: () => getScheduleForBooking(parseInt(scheduleId!)),
    enabled: !!scheduleId,
  });

  // 2) 적립금 잔액
  const { data: pointBalance } = useQuery({
    queryKey: ["point-balance", userId],
    queryFn: () => getBalance(userId),
    staleTime: 0,
  });

  // 3) 약관 목록 (schedule 응답 후 productId 확정 시 호출)
  // ※ 현재 BookingScheduleViewDto에 productId 없음
  //   → scheduleId만으로 공통 약관 조회 (productId는 v2에서 추가 시 확장)
  //   → 백 AgreementController: productId null이면 공통 약관(SCOPE=COMMON)만 반환
  const { data: agreements = [] } = useQuery({
    queryKey: ["agreements", scheduleId],
    queryFn: () => getCurrentAgreements(undefined, scheduleId ? parseInt(scheduleId) : undefined),
    enabled: !!scheduleId,
  });

  // ── useMutation × 2 ──────────────────────────────────────

  const holdMutation = useMutation({
    mutationFn: (req: BookingHoldRequest) => postHold(req),
  });

  const readyMutation = useMutation({
    mutationFn: (req: PaymentReadyRequest) => postReady(req),
  });

  // ── 인원 +/- ─────────────────────────────────────────────
  const maxSelectable = schedule ? Math.min(schedule.remainingCount, 10) : 1;
  const dec = () => setHeadcount((h) => Math.max(1, h - 1));
  const inc = () => setHeadcount((h) => Math.min(maxSelectable, h + 1));

  // ── 가격 계산 (프론트 미리보기 전용) ─────────────────────
  // 실제 결제 amount는 백 holdResponse.finalPrice 그대로 사용
  const totalPrice    = schedule ? schedule.unitPrice * headcount : 0;
  const previewFinal  = Math.max(0, totalPrice - pointUsed);

  // ── 적립금 검증 ──────────────────────────────────────────
  const maxPoint = Math.min(
    pointBalance?.pointBalance ?? 0,
    totalPrice
  );

  // ── 약관 체크 헬퍼 ───────────────────────────────────────
  const requiredAgreements = agreements.filter((a) => a.isRequired === 1);
  const allRequired        = requiredAgreements.every((a) => agreedIds.has(a.agreementId));
  const allChecked         = agreements.length > 0 && agreements.every((a) => agreedIds.has(a.agreementId));

  const toggleAll = (checked: boolean) => {
    if (checked) setAgreedIds(new Set(agreements.map((a) => a.agreementId)));
    else         setAgreedIds(new Set());
  };

  const toggleOne = (id: number, checked: boolean) => {
    setAgreedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else         next.delete(id);
      return next;
    });
  };

  // ── 결제하기 클릭 ────────────────────────────────────────
  const handlePay = async () => {
    if (!scheduleId || !schedule) return;

    // 1) 필수 입력 검증
    const errors: Record<string, string> = {};
    if (!reserverName.trim())  errors.reserverName  = "이름을 입력해주세요.";
    if (!reserverPhone.trim()) errors.reserverPhone = "연락처를 입력해주세요.";
    if (!reserverEmail.trim()) errors.reserverEmail = "이메일을 입력해주세요.";
    if (pointUsed > maxPoint)  errors.pointUsed     = `사용 가능 한도를 초과했습니다. (최대 ${maxPoint.toLocaleString()}P)`;

    // 2) 필수 약관 검증
    if (!allRequired) errors.agreements = "필수 약관에 동의해주세요.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    // 3) holdMutation
    let holdRes: BookingHoldResponse;
    try {
      holdRes = await holdMutation.mutateAsync({
        userId,
        scheduleId: parseInt(scheduleId),
        headcount,
        reserverName:  reserverName.trim(),
        reserverPhone: reserverPhone.trim(),
        reserverEmail: reserverEmail.trim(),
        pointUsed,
        agreementIds: Array.from(agreedIds),
      });
    } catch (err) {
      let msg = "예약에 실패했습니다. 잠시 후 다시 시도해주세요.";
      if (axios.isAxiosError(err) && err.response?.data) {
        msg = typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data);
      }
      alert(msg);
      return;
    }

    // 4) readyMutation
    const origin = window.location.origin;
    let readyRes: PaymentReadyResponse;
    try {
      readyRes = await readyMutation.mutateAsync({
        bookingId:   holdRes.bookingId,
        userId:      holdRes.userId,
        scheduleId:  holdRes.scheduleId,
        itemName:    schedule.productName,
        amount:      holdRes.finalPrice,
        approvalUrl: `${origin}/payment/success/${holdRes.bookingId}`,
        cancelUrl:   `${origin}/payment/cancel/${holdRes.bookingId}`,
        failUrl:     `${origin}/payment/fail/${holdRes.bookingId}`,
      });
    } catch (err) {
      let msg = "결제 준비에 실패했습니다. 잠시 후 다시 시도해주세요.";
      if (axios.isAxiosError(err) && err.response?.data) {
        msg = typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data);
      }
      alert(msg);
      return;
    }

    // 5) sessionStorage 저장
    sessionStorage.setItem(
      `payment_${holdRes.bookingId}`,
      JSON.stringify({
        tid:            readyRes.tid,
        partnerOrderId: readyRes.partnerOrderId,
        userId:         holdRes.userId,
        bookingId:      holdRes.bookingId,
        amount:         holdRes.finalPrice,
        productName:    schedule.productName,
      })
    );

    // 6) 카카오 결제창 이동 (PC/모바일 분기)
    const isMobile = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent);
    window.location.href = isMobile
      ? readyRes.nextRedirectMobileUrl
      : readyRes.nextRedirectPcUrl;
  };

  const isSubmitting = holdMutation.isPending || readyMutation.isPending;

  // ── 결제 버튼 비활성 조건 ─────────────────────────────────
  const payDisabled =
    isSubmitting ||
    !reserverName.trim() ||
    !reserverPhone.trim() ||
    !reserverEmail.trim() ||
    !allRequired ||
    (schedule?.remainingCount ?? 0) <= 0;

  // ── 로딩 / 에러 ──────────────────────────────────────────
  if (scheduleLoading) {
    return (
      <div className="max-w-[520px] mx-auto bg-white p-6">
        <div className="text-sm text-grey-5 tracking-tight-kr">로딩 중...</div>
      </div>
    );
  }

  if (scheduleError || !schedule) {
    return (
      <div className="max-w-[520px] mx-auto bg-white p-6">
        <div className="text-sm text-hc-red tracking-tight-kr">
          일정 정보를 불러올 수 없습니다.
        </div>
      </div>
    );
  }

  const soldOut = schedule.remainingCount <= 0;

  // ── 렌더링 ───────────────────────────────────────────────
  return (
    <div className="max-w-[520px] mx-auto bg-white font-sans tracking-tight-kr">

      {/* ① 검정 헤더 바 */}
      <div className="bg-black text-white px-6 py-5 text-[17px] font-semibold tracking-tight-kr">
        예약 / 결제
      </div>

      <div className="px-6 pb-8">

        {/* ② 예약 정보 카드 */}
        <div className="border border-grey-2 mt-6 mb-6">
          <div className="px-5 pt-4 pb-3 border-b border-grey-1 text-[16px] font-semibold text-black tracking-tight-kr">
            {locationState?.productName ?? schedule.productName}
          </div>
          <table className="w-full text-[14px] px-5">
            <tbody>
              <tr>
                <td className="py-1 pl-5 text-grey-5 w-5/12">출발일</td>
                <td className="py-1 pr-5 text-grey-8 font-medium text-right">
                  {schedule.startDate}
                </td>
              </tr>
              <tr>
                <td className="py-1 pl-5 text-grey-5">종료일</td>
                <td className="py-1 pr-5 text-grey-8 font-medium text-right">
                  {schedule.endDate}
                </td>
              </tr>
              <tr>
                <td className="py-1 pl-5 text-grey-5">1인 가격</td>
                <td className="py-1 pr-5 text-grey-8 font-medium text-right">
                  {schedule.unitPrice.toLocaleString()}원
                </td>
              </tr>
              <tr>
                <td className="py-1 pl-5 pb-4 text-grey-5">남은 자리</td>
                <td className="py-1 pr-5 pb-4 text-right font-semibold">
                  {soldOut ? (
                    <span className="inline-block px-2 py-0.5 bg-hc-red text-white text-[12px] font-semibold">
                      매진
                    </span>
                  ) : (
                    <span className="text-black">{schedule.remainingCount}명</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {soldOut ? (
          <div className="text-center text-sm text-grey-5 py-8 tracking-tight-kr">
            해당 일정은 매진되었습니다.
          </div>
        ) : (
          <>
            {/* ③ 예약자 정보 */}
            <div className="mb-6">
              <div className="text-[15px] font-semibold text-black mb-3 tracking-tight-kr">
                예약자 정보
              </div>

              {/* 이름 */}
              <div className="mb-3">
                <label className="block text-[13px] text-grey-6 mb-1">이름</label>
                <input
                  type="text"
                  value={reserverName}
                  onChange={(e) => setReserverName(e.target.value)}
                  placeholder="홍길동"
                  style={{ borderRadius: 0 }}
                  className={`w-full h-11 px-3 text-[14px] border font-sans
                    ${fieldErrors.reserverName ? "border-hc-red" : "border-grey-3"}
                    focus:outline-none focus:border-black`}
                />
                {fieldErrors.reserverName && (
                  <p className="text-[13px] text-hc-red mt-1 font-medium tracking-tight-kr">
                    {fieldErrors.reserverName}
                  </p>
                )}
              </div>

              {/* 연락처 */}
              <div className="mb-3">
                <label className="block text-[13px] text-grey-6 mb-1">연락처</label>
                <input
                  type="tel"
                  value={reserverPhone}
                  onChange={(e) => setReserverPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  style={{ borderRadius: 0 }}
                  className={`w-full h-11 px-3 text-[14px] border font-sans
                    ${fieldErrors.reserverPhone ? "border-hc-red" : "border-grey-3"}
                    focus:outline-none focus:border-black`}
                />
                {fieldErrors.reserverPhone && (
                  <p className="text-[13px] text-hc-red mt-1 font-medium tracking-tight-kr">
                    {fieldErrors.reserverPhone}
                  </p>
                )}
              </div>

              {/* 이메일 */}
              <div className="mb-3">
                <label className="block text-[13px] text-grey-6 mb-1">이메일</label>
                <input
                  type="email"
                  value={reserverEmail}
                  onChange={(e) => setReserverEmail(e.target.value)}
                  placeholder="example@email.com"
                  style={{ borderRadius: 0 }}
                  className={`w-full h-11 px-3 text-[14px] border font-sans
                    ${fieldErrors.reserverEmail ? "border-hc-red" : "border-grey-3"}
                    focus:outline-none focus:border-black`}
                />
                {fieldErrors.reserverEmail && (
                  <p className="text-[13px] text-hc-red mt-1 font-medium tracking-tight-kr">
                    {fieldErrors.reserverEmail}
                  </p>
                )}
              </div>

              {/* 예약 인원 */}
              <div>
                <label className="block text-[13px] text-grey-6 mb-1">예약 인원</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={dec}
                    disabled={headcount <= 1}
                    style={{ borderRadius: 0 }}
                    className="w-11 h-11 border border-grey-3 text-[18px] text-black
                      disabled:opacity-30 hover:border-black"
                  >
                    −
                  </button>
                  <span className="text-[16px] font-semibold text-black w-10 text-center">
                    {headcount}명
                  </span>
                  <button
                    type="button"
                    onClick={inc}
                    disabled={headcount >= maxSelectable}
                    style={{ borderRadius: 0 }}
                    className="w-11 h-11 border border-grey-3 text-[18px] text-black
                      disabled:opacity-30 hover:border-black"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* ④ 적립금 사용 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[15px] font-semibold text-black tracking-tight-kr">
                  적립금 사용
                </span>
                <span className="text-[11px] text-grey-4">
                  보유 {(pointBalance?.pointBalance ?? 0).toLocaleString()}P
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={pointUsed === 0 ? "" : pointUsed}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setPointUsed(Math.min(val, maxPoint));
                  }}
                  placeholder="0"
                  min={0}
                  max={maxPoint}
                  style={{ borderRadius: 0 }}
                  className={`flex-1 h-11 px-3 text-[14px] border font-sans
                    ${fieldErrors.pointUsed ? "border-hc-red" : "border-grey-3"}
                    focus:outline-none focus:border-black`}
                />
                <button
                  type="button"
                  onClick={() => setPointUsed(maxPoint)}
                  style={{ borderRadius: 0 }}
                  className="px-4 h-11 border border-black text-[13px] font-semibold
                    text-black hover:bg-black hover:text-white transition-colors"
                >
                  모두 사용
                </button>
              </div>
              <p className="text-[11px] text-grey-4 mt-1 tracking-tight-kr">
                최대 {maxPoint.toLocaleString()}P까지 사용 가능
              </p>
              {fieldErrors.pointUsed && (
                <p className="text-[13px] text-hc-red mt-1 font-medium tracking-tight-kr">
                  {fieldErrors.pointUsed}
                </p>
              )}
            </div>

            {/* ⑤ 약관 동의 */}
            <div className="mb-6">
              <div className="text-[15px] font-semibold text-black mb-3 tracking-tight-kr">
                약관 동의
              </div>

              {agreements.length === 0 ? (
                <div className="text-[13px] text-grey-4 tracking-tight-kr">
                  약관 정보를 불러오는 중...
                </div>
              ) : (
                <>
                  {/* 전체 동의 */}
                  <div className="flex items-center gap-2 pb-3 mb-3 border-b border-grey-1">
                    <input
                      type="checkbox"
                      id="agree-all"
                      checked={allChecked}
                      onChange={(e) => toggleAll(e.target.checked)}
                      style={{ borderRadius: 0, width: 16, height: 16, accentColor: "#000" }}
                    />
                    <label
                      htmlFor="agree-all"
                      className="text-[14px] font-semibold text-black cursor-pointer tracking-tight-kr"
                    >
                      전체 동의
                    </label>
                  </div>

                  {/* 약관별 행 — 백이 typeCode ASC 정렬해 응답, 프론트는 그 순서 그대로 */}
                  {agreements.map((a) => (
                    <div key={a.agreementId} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        id={`agree-${a.agreementId}`}
                        checked={agreedIds.has(a.agreementId)}
                        onChange={(e) => toggleOne(a.agreementId, e.target.checked)}
                        style={{ borderRadius: 0, width: 16, height: 16, accentColor: "#000" }}
                      />
                      <label
                        htmlFor={`agree-${a.agreementId}`}
                        className="flex-1 text-[13px] text-grey-8 cursor-pointer tracking-tight-kr"
                      >
                        <span className="text-grey-5 mr-1">
                          {a.isRequired === 1 ? "[필수]" : "[선택]"}
                        </span>
                        {a.title}
                      </label>
                      <button
                        type="button"
                        onClick={() => setModalContent({ title: a.title, content: a.content })}
                        className="text-[12px] text-black underline shrink-0 tracking-tight-kr"
                      >
                        내용보기
                      </button>
                    </div>
                  ))}

                  {fieldErrors.agreements && (
                    <p className="text-[13px] text-hc-red mt-2 font-medium tracking-tight-kr">
                      {fieldErrors.agreements}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* ⑥ 결제 수단 */}
            <div className="mb-6">
              <div className="text-[15px] font-semibold text-black mb-3 tracking-tight-kr">
                결제 수단
              </div>
              <div
                style={{ borderRadius: 0 }}
                className="border-[1.5px] border-black px-4 py-3 flex items-center gap-2.5"
              >
                {/* 라디오 원 — 유일하게 radius 50% 허용 */}
                <span className="w-[18px] h-[18px] rounded-full border-2 border-black
                  flex items-center justify-center shrink-0">
                  <span className="w-[9px] h-[9px] rounded-full bg-black" />
                </span>
                <span className="text-[15px] font-semibold text-black tracking-tight-kr">
                  카카오페이
                </span>
                <span className="ml-auto text-[11px] text-grey-4">간편결제</span>
              </div>
            </div>

            {/* ⑦ 가격 요약 */}
            <div className="mb-6">
              <div className="flex justify-between text-[14px] mb-2">
                <span className="text-grey-5 tracking-tight-kr">
                  {schedule.unitPrice.toLocaleString()}원 × {headcount}명
                </span>
                <span className="text-grey-8 font-medium tracking-tight-num">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
              {pointUsed > 0 && (
                <div className="flex justify-between text-[14px] mb-2">
                  <span className="text-grey-5 tracking-tight-kr">적립금 사용</span>
                  <span className="text-grey-8 font-medium tracking-tight-num">
                    −{pointUsed.toLocaleString()}원
                  </span>
                </div>
              )}
              {/* 총 결제금액 강조선 */}
              <div className="border-t-2 border-black pt-4 flex justify-between items-baseline">
                <span className="text-[15px] font-semibold text-black tracking-tight-kr">
                  총 결제금액
                </span>
                <span className="text-[26px] font-bold text-black tracking-tight-num">
                  {previewFinal.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* ⑧ 결제 버튼 */}
            <button
              type="button"
              onClick={handlePay}
              disabled={payDisabled}
              style={{ borderRadius: 0 }}
              className="w-full py-4 bg-black text-white text-[15px] font-semibold
                tracking-tight-kr disabled:bg-grey-4 disabled:cursor-not-allowed
                hover:bg-grey-8 transition-colors"
            >
              {isSubmitting
                ? "처리 중..."
                : `${previewFinal.toLocaleString()}원 카카오페이로 결제하기`}
            </button>
          </>
        )}
      </div>

      {/* 약관 내용보기 모달 */}
      {modalContent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={() => setModalContent(null)}
        >
          <div
            className="bg-white w-[90%] max-w-[480px] max-h-[70vh] flex flex-col"
            style={{ borderRadius: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-grey-1 flex justify-between items-center">
              <span className="text-[15px] font-semibold text-black tracking-tight-kr">
                {modalContent.title}
              </span>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="text-[20px] text-grey-5 hover:text-black"
              >
                ×
              </button>
            </div>
            <div className="px-5 py-4 overflow-y-auto text-[13px] text-grey-8
              leading-relaxed tracking-tight-kr whitespace-pre-wrap">
              {modalContent.content}
            </div>
            <div className="px-5 py-4 border-t border-grey-1">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                style={{ borderRadius: 0 }}
                className="w-full py-3 bg-black text-white text-[14px] font-semibold
                  tracking-tight-kr"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HoldComponent;