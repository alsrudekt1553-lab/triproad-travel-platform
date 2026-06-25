import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getReviews } from "../../api/productApi";
import { getReviewImages, getReviewImageUrl } from "../../api/reviewApi";

interface ProductReview {
  reviewId: number;
  userId: number;
  bookingId: number;
  scheduleId?: number;
  rating: number;
  content: string;
  createdAt?: string;
}

interface ReviewImage {
  reviewImageId?: number;
  imageId?: number;
  reviewId: number;
  imageName: string;
}

function ProductAllReviewPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [imageMap, setImageMap] = useState<Record<number, ReviewImage[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      if (!productId) return;

      try {
        const data = await getReviews(productId);
        const reviewData = Array.isArray(data) ? data : [];

        setReviews(reviewData);

        const map: Record<number, ReviewImage[]> = {};

        for (const review of reviewData) {
          const images = await getReviewImages(review.reviewId).catch(() => []);

          if (Array.isArray(images)) {
            map[review.reviewId] = images;
          } else if (Array.isArray(images?.dtoList)) {
            map[review.reviewId] = images.dtoList;
          } else if (Array.isArray(images?.list)) {
            map[review.reviewId] = images.list;
          } else {
            map[review.reviewId] = [];
          }
        }

        setImageMap(map);
      } catch (err) {
        console.error("PRODUCT REVIEW LOAD ERROR =>", err);
        alert("상품 후기를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  const averageRating =
    reviews.length === 0
      ? "0.0"
      : (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1);

  if (loading) {
    return <div style={styles.container}>로딩중...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        <div style={styles.titleBox}>
          <h2 style={styles.title}>상품 전체 후기</h2>
          <p style={styles.subTitle}>Product ID : {productId}</p>
        </div>

        <div style={{ width: "100px" }} />
      </div>

      <div style={styles.summaryBox}>
        <div style={styles.summaryScore}>⭐ {averageRating}</div>
        <div style={styles.summaryCount}>총 {reviews.length}개의 후기</div>
      </div>

      {reviews.length === 0 ? (
        <div style={styles.emptyBox}>등록된 후기가 없습니다.</div>
      ) : (
        <div style={styles.listBox}>
          {reviews.map((review) => (
            <div key={review.reviewId} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <div style={styles.rating}>
                    {"★".repeat(Number(review.rating))}
                    {"☆".repeat(5 - Number(review.rating))}
                  </div>

                  <div style={styles.meta}>
                    작성자 ID: {review.userId} / 예약번호: {review.bookingId} / 일정번호:{" "}
                    {review.scheduleId}
                  </div>
                </div>

                <div style={styles.date}>
                  {review.createdAt ? review.createdAt.substring(0, 10) : ""}
                </div>
              </div>

              {(imageMap[review.reviewId] ?? []).length > 0 && (
                <div style={styles.imageContainer}>
                  {(imageMap[review.reviewId] ?? []).map((img) => (
                    <img
                      key={img.reviewImageId ?? img.imageId ?? img.imageName}
                      src={getReviewImageUrl(img.imageName)}
                      alt="리뷰 이미지"
                      style={styles.reviewImage}
                    />
                  ))}
                </div>
              )}

              <p style={styles.content}>{review.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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
  titleBox: {
    textAlign: "center",
  },
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
    width: "100px",
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: 600,
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
  date: {
    fontSize: "13px",
    color: "#94a3b8",
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
};

export default ProductAllReviewPage;