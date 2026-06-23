import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  deleteReview,
  getReviewsBySchedule,
  getReviewSummary,
  getReviewImages,
  getReviewImageUrl,
} from "../../api/reviewApi";
import type { Review, ReviewSummary } from "../../types/review";

interface LoginUser {
  USER_ID: number;
  LOGIN_ID?: string;
  NICKNAME?: string;
  NAME?: string;
  ROLE?: number;
  RESULT?: string;
}

interface ReviewImage {
  reviewImageId?: number;
  imageId?: number;
  reviewId: number;
  imageName: string;
  imageOrder?: number;
}

const ProductReviewPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [imageMap, setImageMap] = useState<Record<number, ReviewImage[]>>({});
  const [summary, setSummary] = useState<ReviewSummary>({
    scheduleId: 0,
    avgRating: 0,
    reviewCount: 0,
  });
  const [sortType, setSortType] = useState("latest");

  useEffect(() => {
    const savedUser = localStorage.getItem("loginUser");

    if (savedUser) {
      try {
        setLoginUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("loginUser 파싱 실패", err);
        localStorage.removeItem("loginUser");
      }
    }
  }, []);

  const loadSummary = async () => {
    if (!scheduleId) return;

    try {
      const data = await getReviewSummary(scheduleId);
      setSummary(data);
    } catch (err) {
      console.error("REVIEW SUMMARY ERROR =>", err);
    }
  };

  const loadImages = async (reviews: Review[]) => {
    try {
      const map: Record<number, ReviewImage[]> = {};

      for (const review of reviews) {
        const data = await getReviewImages(review.reviewId);

        if (Array.isArray(data)) {
          map[review.reviewId] = data;
        } else if (Array.isArray(data?.dtoList)) {
          map[review.reviewId] = data.dtoList;
        } else if (Array.isArray(data?.list)) {
          map[review.reviewId] = data.list;
        } else {
          map[review.reviewId] = [];
        }
      }

      setImageMap(map);
    } catch (err) {
      console.error("REVIEW IMAGE LOAD ERROR =>", err);
    }
  };

  const loadReviews = async () => {
    if (!scheduleId) return;

    try {
      const data = await getReviewsBySchedule(scheduleId, sortType);

      let reviews: Review[] = [];

      if (Array.isArray(data)) {
        reviews = data;
      } else if (Array.isArray(data.dtoList)) {
        reviews = data.dtoList;
      } else if (Array.isArray(data.list)) {
        reviews = data.list;
      }

      setReviewList(reviews);
      loadImages(reviews);
    } catch (err) {
      console.error("REVIEW LIST ERROR =>", err);
      alert("리뷰 목록 조회 실패");
    }
  };

  useEffect(() => {
    loadSummary();
    loadReviews();
  }, [scheduleId, sortType]);

  const moveAddPage = () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigate("/user01/login");
      return;
    }

    navigate(`/review/add/${scheduleId}`);
  };

  const handleDelete = async (reviewId: number) => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigate("/user01/login");
      return;
    }

    if (!window.confirm("리뷰를 삭제하시겠습니까?")) return;

    try {
      await deleteReview(reviewId);
      alert("삭제되었습니다.");
      loadSummary();
      loadReviews();
    } catch (err: any) {
      console.error("REVIEW DELETE ERROR =>", err);

      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/user01/login");
        return;
      }

      alert(err.response?.data?.message || err.response?.data || "삭제 실패");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        <div style={styles.titleBox}>
          <h2 style={styles.title}>일정 리뷰</h2>
          <p style={styles.subTitle}>Schedule ID : {scheduleId}</p>
        </div>

        <button style={styles.addBtn} onClick={moveAddPage}>
          리뷰 작성
        </button>
      </div>

      <div style={styles.summaryBox}>
        <div style={styles.summaryScore}>
          ⭐ {summary.avgRating ? summary.avgRating.toFixed(1) : "0.0"}
        </div>
        <div style={styles.summaryCount}>
          총 {summary.reviewCount || 0}개의 리뷰
        </div>
      </div>

      <div style={styles.filterBox}>
        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          style={styles.select}
        >
          <option value="latest">최신순</option>
          <option value="old">오래된순</option>
          <option value="highRating">별점 높은순</option>
          <option value="lowRating">별점 낮은순</option>
        </select>
      </div>

      {reviewList.length === 0 ? (
        <div style={styles.emptyBox}>등록된 리뷰가 없습니다.</div>
      ) : (
        <div style={styles.listBox}>
          {reviewList.map((review) => {
            const isOwner = loginUser?.USER_ID === review.userId;
            const isAdmin = loginUser?.ROLE === 900;

            return (
              <div key={review.reviewId} style={styles.card}>
                <div style={styles.cardTop}>
                  <div>
                    <div style={styles.rating}>
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>

                    <div style={styles.meta}>
                      작성자 ID: {review.userId} / 예약번호: {review.bookingId}
                    </div>
                  </div>

                  {(isOwner || isAdmin) && (
                    <div style={styles.buttonGroup}>
                      {isOwner && (
                        <button
                          style={styles.modifyBtn}
                          onClick={() =>
                            navigate(`/review/modify/${review.reviewId}`)
                          }
                        >
                          수정
                        </button>
                      )}

                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(review.reviewId)}
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>

                {imageMap[review.reviewId]?.length > 0 && (
                  <div style={styles.imageContainer}>
                    {imageMap[review.reviewId].map((img) => (
                      <img
                        key={img.reviewImageId ?? img.imageId}
                        src={getReviewImageUrl(img.imageName)}
                        alt="리뷰 이미지"
                        style={styles.reviewImage}
                      />
                    ))}
                  </div>
                )}

                <p style={styles.content}>{review.content}</p>

                <div style={styles.date}>
                  {review.createdAt ? review.createdAt.substring(0, 10) : ""}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "90%",
    maxWidth: "950px",
    margin: "40px auto",
    padding: "28px",
    backgroundColor: "#fff",
    borderRadius: "18px",
    boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
  },
  titleBox: { textAlign: "center" },
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    color: "#1e293b",
  },
  subTitle: {
    marginTop: "6px",
    color: "#64748b",
  },
  backBtn: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: 600,
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
  summaryBox: {
    padding: "26px",
    borderRadius: "16px",
    backgroundColor: "#f8fafc",
    marginBottom: "22px",
    textAlign: "center",
    border: "1px solid #e2e8f0",
  },
  summaryScore: {
    fontSize: "34px",
    color: "#f59e0b",
    fontWeight: 800,
  },
  summaryCount: {
    marginTop: "8px",
    color: "#64748b",
    fontSize: "15px",
  },
  filterBox: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
  },
  emptyBox: {
    padding: "70px",
    textAlign: "center",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    borderRadius: "14px",
    border: "1px dashed #cbd5e1",
  },
  listBox: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  card: {
    padding: "22px",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  rating: {
    fontSize: "22px",
    color: "#f59e0b",
    letterSpacing: "2px",
    marginBottom: "8px",
  },
  meta: {
    fontSize: "14px",
    color: "#64748b",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  modifyBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#10b981",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  deleteBtn: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  imageContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "18px",
  },
  reviewImage: {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
  content: {
    marginTop: "18px",
    fontSize: "16px",
    lineHeight: 1.8,
    color: "#334155",
    whiteSpace: "pre-wrap",
  },
  date: {
    marginTop: "14px",
    fontSize: "13px",
    color: "#94a3b8",
  },
};

export default ProductReviewPage;