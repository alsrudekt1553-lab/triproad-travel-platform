import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

interface Props {
  scheduleId: number;
}

interface ReviewSummary {
  avgRating: number;
  reviewCount: number;
}

interface ReviewDto {
  reviewId: number;
  rating: number;
  content: string;
  createdAt?: string;
}

const ProductReviewSummary = ({ scheduleId }: Props) => {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<ReviewSummary>({
    avgRating: 0,
    reviewCount: 0,
  });

  const [reviewList, setReviewList] = useState<ReviewDto[]>([]);

  useEffect(() => {
    loadSummary();
    loadLatestReviews();
  }, [scheduleId]);

  const loadSummary = async () => {
    try {
      const res = await axios.get(`/api/review/summary/${scheduleId}`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLatestReviews = async () => {
    try {
      const res = await axios.get(`/api/review/schedule/${scheduleId}`, {
        params: { sort: "latest" },
      });

      const data = res.data;

      let list: ReviewDto[] = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.dtoList)) {
        list = data.dtoList;
      } else if (Array.isArray(data.list)) {
        list = data.list;
      }

      setReviewList(list.slice(0, 3));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.topArea}>
        <div>
          <h3 style={styles.score}>⭐ 평점 {summary.avgRating?.toFixed(1)}</h3>
          <p style={styles.count}>리뷰 {summary.reviewCount}개</p>
        </div>

        <button
          style={styles.addBtn}
          onClick={() => navigate(`/review/add/${scheduleId}`)}
        >
          리뷰 등록
        </button>
      </div>

      <div style={styles.divider} />

      <h4 style={styles.latestTitle}>최신 리뷰</h4>

      {reviewList.length === 0 ? (
        <div style={styles.empty}>아직 등록된 리뷰가 없습니다.</div>
      ) : (
        <div style={styles.reviewList}>
          {reviewList.map((review) => (
            <div key={review.reviewId} style={styles.reviewItem}>
              <div style={styles.star}>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <div style={styles.reviewText}>
                {review.content.length > 55
                  ? review.content.substring(0, 55) + "..."
                  : review.content}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.moreBox}>
        <button
          style={styles.moreBtn}
          onClick={() => navigate(`/review/schedule/${scheduleId}`)}
        >
          리뷰 전체보기
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: "40px",
    padding: "30px",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 18px rgba(0,0,0,0.06)",
  },
  topArea: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  score: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 800,
    color: "#1e293b",
  },
  count: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "15px",
  },
  addBtn: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "24px 0",
  },
  latestTitle: {
    margin: "0 0 16px 0",
    fontSize: "20px",
    fontWeight: 700,
    color: "#334155",
  },
  empty: {
    padding: "28px",
    textAlign: "center",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
  },
  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  reviewItem: {
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  star: {
    color: "#f59e0b",
    fontSize: "17px",
    marginBottom: "8px",
    letterSpacing: "1px",
  },
  reviewText: {
    color: "#334155",
    lineHeight: 1.6,
  },
  moreBox: {
    textAlign: "center",
    marginTop: "24px",
  },
  moreBtn: {
    padding: "11px 22px",
    border: "1px solid #2563eb",
    borderRadius: "10px",
    backgroundColor: "#fff",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default ProductReviewSummary;