import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getReviewOne,
  putReview,
  getReviewImages,
  postReviewImage,
  deleteReviewImage,
  getReviewImageUrl,
} from "../../api/reviewApi";

interface ReviewDto {
  reviewId: number;
  scheduleId: number;
  bookingId: number;
  userId: number;
  rating: number;
  content: string;
}

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

const ReviewModifyPage = () => {
  const { reviewId } = useParams();
  const navigate = useNavigate();

  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);
  const [review, setReview] = useState<ReviewDto | null>(null);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [imageList, setImageList] = useState<ReviewImage[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("loginUser");

    if (savedUser) {
      try {
        setLoginUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("loginUser 파싱 실패", err);
        localStorage.removeItem("loginUser");
      }
    } else {
      alert("로그인이 필요합니다.");
      navigate("/user01/login");
    }
  }, [navigate]);

  useEffect(() => {
    loadReview();
    loadImages();
  }, [reviewId]);

  const loadReview = async () => {
    if (!reviewId) return;

    try {
      const data = await getReviewOne(reviewId);

      setReview(data);
      setRating(data.rating);
      setContent(data.content);
    } catch (err) {
      console.error("REVIEW GET ERROR =>", err);
      alert("리뷰 조회 실패");
    }
  };

  const loadImages = async () => {
    if (!reviewId) return;

    try {
      const data = await getReviewImages(reviewId);

      if (Array.isArray(data)) {
        setImageList(data);
      } else if (Array.isArray(data?.dtoList)) {
        setImageList(data.dtoList);
      } else if (Array.isArray(data?.list)) {
        setImageList(data.list);
      } else {
        setImageList([]);
      }
    } catch (err) {
      console.error("REVIEW IMAGE GET ERROR =>", err);
      setImageList([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewFiles(files);
  };

  const handleDeleteImage = async (imageId: number | undefined) => {
    if (!imageId) {
      alert("이미지 번호가 없습니다.");
      return;
    }

    if (!window.confirm("이미지를 삭제하시겠습니까?")) return;

    try {
      await deleteReviewImage(imageId);

      alert("이미지가 삭제되었습니다.");
      loadImages();
    } catch (err) {
      console.error("REVIEW IMAGE DELETE ERROR =>", err);
      alert("이미지 삭제 실패");
    }
  };

  const modifyReview = async () => {
    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigate("/user01/login");
      return;
    }

    if (!review) {
      alert("리뷰 정보를 불러오지 못했습니다.");
      return;
    }

    if (loginUser.USER_ID !== review.userId) {
      alert("본인이 작성한 후기만 수정할 수 있습니다.");
      navigate(`/review/schedule/${review.scheduleId}`);
      return;
    }

    if (!content.trim()) {
      alert("리뷰 내용을 입력하세요.");
      return;
    }

    try {
            console.log("MODIFY REQUEST =>", {
  reviewId: Number(reviewId),
  scheduleId: review.scheduleId,
  bookingId: review.bookingId,
  rating,
  content,
});

await putReview({
  reviewId: Number(reviewId),
  scheduleId: review.scheduleId,
  bookingId: review.bookingId,
  rating,
  content,
});

      if (newFiles.length > 0 && reviewId) {
        await postReviewImage(reviewId, newFiles);
      }

      alert("수정되었습니다.");
      navigate(`/review/schedule/${review.scheduleId}`);
    } catch (err) {
      console.error("REVIEW MODIFY ERROR =>", err);
      alert("수정 실패");
    }
  };

  if (!review) {
    return <div style={styles.loading}>로딩 중...</div>;
  }

  const isOwner = loginUser?.USER_ID === review.userId;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        <div>
          <h2 style={styles.title}>리뷰 수정</h2>
          <p style={styles.subTitle}>Review ID : {review.reviewId}</p>
        </div>

        <div style={{ width: "86px" }} />
      </div>

      <div style={styles.infoBox}>
        <div>일정번호: {review.scheduleId}</div>
        <div>예약번호: {review.bookingId}</div>
        <div>작성자 ID: {review.userId}</div>
      </div>

      {!isOwner && (
        <div style={styles.warningBox}>
          본인이 작성한 후기만 수정할 수 있습니다.
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>별점</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={styles.input}
          disabled={!isOwner}
        >
          <option value={5}>★★★★★ 5점</option>
          <option value={4}>★★★★☆ 4점</option>
          <option value={3}>★★★☆☆ 3점</option>
          <option value={2}>★★☆☆☆ 2점</option>
          <option value={1}>★☆☆☆☆ 1점</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>리뷰 내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
          disabled={!isOwner}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>현재 이미지</label>

        {imageList.length === 0 ? (
          <div style={styles.emptyImageBox}>등록된 이미지가 없습니다.</div>
        ) : (
          <div style={styles.imageContainer}>
            {imageList.map((img) => {
              const imageId = img.reviewImageId ?? img.imageId;

              return (
                <div key={imageId} style={styles.imageBox}>
                  <img
                    src={getReviewImageUrl(img.imageName)}
                    alt="리뷰 이미지"
                    style={styles.reviewImage}
                  />

                  {isOwner && (
                    <button
                      style={styles.imageDeleteBtn}
                      onClick={() => handleDeleteImage(imageId)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isOwner && (
        <div style={styles.formGroup}>
          <label style={styles.label}>이미지 추가</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={styles.fileInput}
          />

          {newFiles.length > 0 && (
            <div style={styles.fileInfo}>
              추가 예정 이미지 {newFiles.length}개
            </div>
          )}
        </div>
      )}

      <div style={styles.btnBox}>
        <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
          취소
        </button>

        {isOwner && (
          <button style={styles.submitBtn} onClick={modifyReview}>
            수정
          </button>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  loading: {
    padding: "80px",
    textAlign: "center",
    color: "#64748b",
  },
  container: {
    width: "90%",
    maxWidth: "760px",
    margin: "40px auto",
    padding: "30px",
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
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    color: "#1e293b",
    textAlign: "center",
  },
  subTitle: {
    marginTop: "6px",
    color: "#64748b",
    textAlign: "center",
  },
  backBtn: {
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  infoBox: {
    padding: "18px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    marginBottom: "24px",
    color: "#475569",
    lineHeight: 1.9,
    border: "1px solid #e2e8f0",
  },
  warningBox: {
    padding: "14px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    borderRadius: "10px",
    marginBottom: "22px",
    fontWeight: 700,
  },
  formGroup: {
    marginBottom: "22px",
  },
  label: {
    display: "block",
    marginBottom: "9px",
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    height: "190px",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "15px",
    resize: "none",
    lineHeight: 1.7,
  },
  emptyImageBox: {
    padding: "30px",
    textAlign: "center",
    color: "#64748b",
    backgroundColor: "#f8fafc",
    border: "1px dashed #cbd5e1",
    borderRadius: "12px",
  },
  imageContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  imageBox: {
    position: "relative",
    width: "130px",
  },
  reviewImage: {
    width: "130px",
    height: "130px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
  },
  imageDeleteBtn: {
    width: "100%",
    marginTop: "6px",
    padding: "7px 0",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  fileInput: {
    width: "100%",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    boxSizing: "border-box",
  },
  fileInfo: {
    marginTop: "8px",
    color: "#2563eb",
    fontWeight: 700,
    fontSize: "14px",
  },
  btnBox: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "28px",
  },
  cancelBtn: {
    padding: "11px 18px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  submitBtn: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#10b981",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default ReviewModifyPage;