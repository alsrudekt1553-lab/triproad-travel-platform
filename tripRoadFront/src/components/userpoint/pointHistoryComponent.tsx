import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getBalance, getHistory } from "../../api/pointApi";
import { getCurrentUserId } from "../../api/sessionHelper";

const extractFriendlyMessage = (err: unknown, defaultMsg: string): string => {
  console.error("[Point] 에러 상세:", err);
  if (!axios.isAxiosError(err) || !err.response?.data) return defaultMsg;
  const data = err.response.data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0 && message.length < 200) return message;
  }
  if (typeof data === "string" && data.length > 0 && data.length < 200) return data;
  return defaultMsg;
};

const historyTypeLabel = (type: number) => {
  if (type === 100) return "적립";
  if (type === 200) return "사용";
  if (type === 300) return "환원";
  if (type === 400) return "만료";
  return `유형 ${type}`;
};

const historyTypeBorderClass = (type: number) => {
  if (type === 100) return "border-l-[3px] border-l-black";  
  if (type === 300) return "border-l-[3px] border-l-grey-7";  
  if (type === 200) return "border-l-[3px] border-l-grey-5";  
  return "border-l-[3px] border-l-grey-2";                    
};

const historyAmountStyle = (type: number) => {
  if (type === 100 || type === 300) return { sign: "+", color: "text-black" };
  return { sign: "−", color: "text-grey-5" };
};

const formatDateTime = (dt: string | null) => {
  if (!dt) return "-";
  const d = new Date(dt);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

function PointHistoryComponent() {
  const userId = getCurrentUserId();

  const balanceQuery = useQuery<UserPointBalance>({
    queryKey: ["pointBalance", userId],
    queryFn: () => getBalance(userId),
  });

  const historyQuery = useQuery<UserPointHistory[]>({
    queryKey: ["pointHistory", userId],
    queryFn: () => getHistory(userId),
  });

  if (balanceQuery.isLoading || historyQuery.isLoading) {
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            적립금 내역
          </div>
        </div>
        <div className="max-w-[480px] mx-auto px-6 py-8 text-[14px] text-grey-5">
          로딩 중...
        </div>
      </div>
    );
  }

  if (balanceQuery.isError || historyQuery.isError) {
    const errMsg = extractFriendlyMessage(
      balanceQuery.error || historyQuery.error,
      "적립금 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
    );
    return (
      <div className="w-full font-sans tracking-tight-kr">
        <div className="bg-black text-white">
          <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
            적립금 내역
          </div>
        </div>
        <div className="max-w-[480px] mx-auto px-6 py-8 text-[14px] text-grey-5">
          {errMsg}
        </div>
      </div>
    );
  }

  const balance = balanceQuery.data;
  const history = historyQuery.data ?? [];

  return (
    <div className="w-full font-sans tracking-tight-kr">
      <div className="bg-black text-white">
        <div className="px-6 py-5 text-[19px] font-semibold tracking-tight-kr text-center md:text-left">
          적립금 내역
        </div>
      </div>

      <div className="max-w-[480px] mx-auto">
        <div className="px-4 pt-10 pb-2">
          <div
            className="bg-white border border-grey-2 border-l-[3px] border-l-black px-5 py-6"
            style={{ borderRadius: 0 }}
          >
            <div className="text-[12px] text-grey-5 tracking-tight-kr mb-2">
              보유 적립금
            </div>
            <div className="text-[26px] font-semibold text-black tracking-tight-num">
              {(balance?.pointBalance ?? 0).toLocaleString()}
              <span className="text-[18px] ml-1">P</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col px-4 pt-8 pb-4">
          <div className="text-[14px] font-semibold text-black tracking-tight-kr mb-3 px-1">
            적립금 이력
          </div>

          {history.length === 0 ? (
            <div className="px-2 py-6 text-[14px] text-grey-5">
              적립금 이력이 없습니다.
            </div>
          ) : (
            history.map((h) => {
              const { sign, color } = historyAmountStyle(h.historyType);
              return (
                <div
                  key={h.historyId}
                  className={`mb-4 bg-white border border-grey-2 ${historyTypeBorderClass(h.historyType)}`}
                  style={{ borderRadius: 0 }}
                >
                  <div className="px-5 py-3 border-b border-grey-2 flex items-center justify-between tracking-tight-kr">
                    <span className="text-[12px] text-grey-5">
                      {historyTypeLabel(h.historyType)}
                      {h.bookingId != null && (
                        <>
                          <span className="inline-block w-[10px]" />
                          <span>예약 </span>
                          <span className="font-medium" style={{ fontFamily: "monospace" }}>
                            {h.bookingId}
                          </span>
                        </>
                      )}
                    </span>
                    <span className="text-[11px] text-grey-5 tracking-tight-num">
                      {formatDateTime(h.createdAt)}
                    </span>
                  </div>

                  <div className="px-5 py-4 flex justify-between items-baseline">
                    <span className="text-[12px] text-grey-5 tracking-tight-kr">
                      변동 후 잔액
                      <span className="inline-block w-[6px]" />
                      <span className="tracking-tight-num">
                        {h.pointBalanceAfter.toLocaleString()}P
                      </span>
                    </span>
                    <span className={`text-[18px] font-semibold tracking-tight-num ${color}`}>
                      {sign}{h.pointAmount.toLocaleString()}P
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default PointHistoryComponent;