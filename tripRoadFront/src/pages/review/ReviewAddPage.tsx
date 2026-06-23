import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { postReview } from "../../api/reviewApi";
import { uploadReviewImages } from "../../api/reviewImageApi";
import type { ReviewAdd } from "../../types/review";

interface LoginUser {
  USER_ID: number;
  LOGIN_ID?: string;
  NICKNAME?: string;
  NAME?: string;
  ROLE?: number;
  RESULT?: string;
}

const ReviewAddPage = () => {
  const { scheduleId } = useParams();
  const navigate = useNavigate();

  const [loginUser, setLoginUser] = useState<LoginUser | null>(null);

  const [bookingId, setBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

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

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 5) {
      alert("이미지는 최대 5장까지 등록할 수 있습니다.");
      return;
    }

    const onlyImages = files.filter((file) => file.type.startsWith("image/"));

    if (onlyImages.length !== files.length) {
      alert("이미지 파일만 선택할 수 있습니다.");
      return;
    }

    previewUrls.forEach((url) => URL.revokeObjectURL(url));

    setImageFiles(onlyImages);
    setPreviewUrls(onlyImages.map((file) => URL.createObjectURL(file)));
  };

  const removeSelectedImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);

    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const submitReview = async () => {
    if (!scheduleId) {
      alert("일정 정보가 없습니다.");
      return;
    }

    if (!loginUser) {
      alert("로그인이 필요합니다.");
      navigate("/user01/login");
      return;
    }

    if (!bookingId.trim()) {
      alert("예약번호를 입력하세요.");
      return;
    }

    if (!content.trim()) {
      alert("리뷰 내용을 입력하세요.");
      return;
    }

    const reviewObj: ReviewAdd = {
      scheduleId: Number(scheduleId),
      bookingId: Number(bookingId),
      rating,
      content,
    };

    try {
      const reviewId = await postReview(reviewObj);

      if (imageFiles.length > 0) {
        await uploadReviewImages(reviewId, imageFiles);
      }

      alert("리뷰가 등록되었습니다.");
      navigate(`/review/schedule/${scheduleId}`);
    } catch (err: any) {
      console.error("REVIEW ADD ERROR =>", err);

      if (err.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/user01/login");
        return;
      }

      alert(err.response?.data?.message || err.response?.data || "리뷰 등록 실패");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>

        <div>
          <h2 style={styles.title}>리뷰 작성</h2>
          <p style={styles.subTitle}>Schedule ID : {scheduleId}</p>
        </div>

        <div style={{ width: "86px" }} />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>예약번호</label>
        <input
          type="number"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          style={styles.input}
          placeholder="테스트용 bookingId 입력"
        />
        <p style={styles.helpText}>예약 완료된 booking_id를 입력하세요.</p>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>별점</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          style={styles.input}
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
          placeholder="여행 일정에 대한 후기를 입력하세요."
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>리뷰 이미지</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={styles.input}
        />
        <p style={styles.helpText}>이미지는 최대 5장까지 등록 가능합니다.</p>

        {previewUrls.length > 0 && (
          <div style={styles.previewBox}>
            {previewUrls.map((url, index) => (
              <div key={url} style={styles.previewItem}>
                <img src={url} alt={`preview-${index}`} style={styles.previewImg} />
                <button
                  type="button"
                  style={styles.previewRemoveBtn}
                  onClick={() => removeSelectedImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.btnBox}>
        <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
          취소
        </button>

        <button style={styles.submitBtn} onClick={submitReview}>
          등록
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
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
  helpText: {
    marginTop: "7px",
    fontSize: "13px",
    color: "#94a3b8",
  },
  previewBox: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  previewItem: {
    position: "relative",
    width: "110px",
    height: "110px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  previewRemoveBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    width: "24px",
    height: "24px",
    border: "none",
    borderRadius: "50%",
    backgroundColor: "rgba(0,0,0,0.65)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
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
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};

export default ReviewAddPage;