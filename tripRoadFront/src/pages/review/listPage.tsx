import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getReviewSummary } from "../../api/reviewApi";

type ReviewMenu = {
  scheduleId: number;
  title: string;
  desc: string;
  tag: string;
  rating: string;
  count: number;
};

const baseMenus = [
  {
    scheduleId: 100005,
    title: "제주 자연 패키지",
    desc: "숲길, 오름, 자연 명소 중심의 제주 여행 후기",
    tag: "자연",
  },
  {
    scheduleId: 100011,
    title: "제주 도착 및 숲길 산책",
    desc: "제주 숲길을 따라 여유롭게 즐기는 자연 여행 후기",
    tag: "제주",
  },
  {
    scheduleId: 100099,
    title: "항일암 일출 + 돌산공원",
    desc: "아름다운 일출과 돌산공원의 야경을 함께 즐긴 여행 후기",
    tag: "일출",
  },
];

function ListPage() {
  const navigate = useNavigate();
  const [reviewMenus, setReviewMenus] = useState<ReviewMenu[]>([]);

  useEffect(() => {
    const loadSummary = async () => {
      const result = await Promise.all(
        baseMenus.map(async (item) => {
          const summary = await getReviewSummary(item.scheduleId);

          return {
            ...item,
            rating: Number(summary.avgRating || 0).toFixed(1),
            count: Number(summary.reviewCount || 0),
          };
        })
      );

      setReviewMenus(result);
    };

    loadSummary();
  }, []);

  return (
    <div style={styles.container}>
      <section style={styles.hero}>
        <p style={styles.badge}>TripRoad Review</p>
        <h2 style={styles.title}>여행자들의 생생한 후기</h2>
        <p style={styles.desc}>
          실제 여행자들이 남긴 평점과 사진 후기를 확인하고,
          나에게 맞는 여행 상품을 선택해보세요.
        </p>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>후기가 등록된 여행상품</h3>
          <p style={styles.sectionDesc}>
            여행자들이 남긴 후기는 상품별로 확인할 수 있습니다.
            원하는 상품을 선택하면 해당 상품의 전체 후기를 볼 수 있습니다.
          </p>
        </div>

        <div style={styles.grid}>
          {reviewMenus.map((item) => (
            <div key={item.scheduleId} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={styles.tag}>{item.tag}</span>
                <span style={styles.schedule}>Schedule {item.scheduleId}</span>
              </div>

              <h4 style={styles.cardTitle}>{item.title}</h4>
              <p style={styles.cardDesc}>{item.desc}</p>

              <div style={styles.scoreBox}>
                <span style={styles.star}>★</span>
                <strong style={styles.rating}>{item.rating}</strong>
                <span style={styles.count}>후기 {item.count}개</span>
              </div>

              <p style={styles.reviewHint}>실제 여행자 후기 확인</p>

              <button
                style={styles.primaryBtn}
                onClick={() => navigate(`/review/schedule/${item.scheduleId}`)}
              >
                이 상품 후기 전체보기
              </button>
            </div>
          ))}
        </div>

        <div style={styles.moreGuide}>
          현재 표시되는 상품은 대표 후기 상품입니다.
          더 많은 후기는 각 여행상품 상세 페이지에서 확인할 수 있습니다.
        </div>
      </section>

      <section style={styles.guideBox}>
        <h3 style={styles.guideTitle}>후기 작성 안내</h3>
        <p style={styles.guideText}>
          여행을 예약하고 완료한 회원은 상품 상세 페이지 또는 일정별 리뷰 페이지에서
          후기를 작성할 수 있습니다. 작성한 후기는 본인만 수정하거나 삭제할 수 있습니다.
        </p>
      </section>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "34px auto",
    padding: "0 20px 50px",
    boxSizing: "border-box",
  },
  hero: {
    padding: "44px 40px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 55%, #ffffff 100%)",
    marginBottom: "34px",
    border: "1px solid #dbeafe",
  },
  badge: {
    display: "inline-block",
    margin: "0 0 12px",
    padding: "7px 13px",
    borderRadius: "999px",
    backgroundColor: "#0284c7",
    color: "#fff",
    fontWeight: 800,
    fontSize: "13px",
  },
  title: {
    margin: 0,
    fontSize: "34px",
    fontWeight: 900,
    color: "#0f172a",
  },
  desc: {
    marginTop: "13px",
    maxWidth: "650px",
    color: "#475569",
    fontSize: "16px",
    lineHeight: 1.7,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 26px rgba(15, 23, 42, 0.08)",
  },
  sectionHeader: {
    marginBottom: "22px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 900,
    color: "#1e293b",
  },
  sectionDesc: {
    marginTop: "8px",
    color: "#64748b",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  card: {
    padding: "22px",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    backgroundColor: "#ffffff",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  tag: {
    padding: "6px 11px",
    borderRadius: "999px",
    backgroundColor: "#ecfeff",
    color: "#0891b2",
    fontSize: "13px",
    fontWeight: 800,
  },
  schedule: {
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 700,
  },
  cardTitle: {
    margin: "0 0 9px",
    fontSize: "20px",
    fontWeight: 900,
    color: "#111827",
  },
  cardDesc: {
    minHeight: "48px",
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: "18px",
  },
  scoreBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "6px",
  },
  star: {
    color: "#f59e0b",
    fontSize: "23px",
  },
  rating: {
    fontSize: "22px",
    color: "#f59e0b",
  },
  count: {
    color: "#64748b",
    fontWeight: 700,
  },
  reviewHint: {
    margin: "0 0 16px",
    color: "#94a3b8",
    fontSize: "13px",
    fontWeight: 700,
  },
  primaryBtn: {
    width: "100%",
    padding: "12px 16px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "15px",
  },
  guideBox: {
    marginTop: "22px",
    padding: "24px",
    borderRadius: "18px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  guideTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "20px",
    fontWeight: 900,
  },
  guideText: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.7,
  },
  moreGuide: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
    fontWeight: 700,
    lineHeight: 1.6,
    border: "1px solid #e2e8f0",
  },
};

export default ListPage;