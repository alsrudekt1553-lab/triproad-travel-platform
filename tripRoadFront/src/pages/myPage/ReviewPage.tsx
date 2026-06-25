import { useEffect, useMemo, useState } from "react";
import {
  getMyReviews,
  deleteMyReview,
  updateMyReview,
} from "../../api/reviewMyPageApi";
import {
  getReviewImages,
  getReviewImageUrl,
} from "../../api/reviewImageApi";


type ReviewPageProps = {
  userId: number;
};

type MyReview = {
  reviewId: number;
  bookingId?: number;
  userId: number;
  scheduleId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  nickname?: string;
  imageName?: string | null;
};

function ReviewPage({ userId }: ReviewPageProps) {
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [sort, setSort] = useState("latest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);

    getMyReviews(userId)
      .then(async (data) => {
        const reviewsWithImages = await Promise.all(
          data.map(async (review: MyReview) => {
            const images = await getReviewImages(review.reviewId);

            return {
              ...review,
              imageName:
                images.length > 0
                  ? images[0].imageName
                  : null,
            };
          })
        );

        setReviews(reviewsWithImages);
      })
      .catch((err) => {
        console.log("MY REVIEW ERROR =>", err);
        alert("후기를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);


  const removeReview = async (reviewId: number) => {
    if (!confirm("후기를 삭제하시겠습니까?")) return;

    try {
      await deleteMyReview(reviewId, userId);

      setReviews((prev) =>
        prev.filter((review) => review.reviewId !== reviewId)
      );

      alert("후기가 삭제되었습니다.");
    } catch (err) {
      console.error("MY REVIEW DELETE ERROR =>", err);
      alert("후기 삭제 실패");
    }
  };

  const editReview = async (
    reviewId: number,
    oldRating: number,
    oldContent: string
  ) => {
    const newContent = prompt("수정할 후기 내용을 입력하세요.", oldContent);

    if (!newContent || newContent.trim() === "") return;

    try {
      await updateMyReview(reviewId, userId, {
        rating: oldRating,
        content: newContent,
      });

      setReviews((prev) =>
        prev.map((review) =>
          review.reviewId === reviewId
            ? { ...review, content: newContent }
            : review
        )
      );

      alert("후기가 수정되었습니다.");
    } catch (err) {
      console.error("MY REVIEW UPDATE ERROR =>", err);
      alert("후기 수정 실패");
    }
  };

  const sortedReviews = useMemo(() => {
    const copied = [...reviews];

    if (sort === "high") {
      copied.sort((a, b) => b.rating - a.rating);
    } else {
      copied.sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
    }

    return copied;
  }, [reviews, sort]);

  const averageRating =
    reviews.length === 0
      ? "0.0"
      : (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1);

  if (loading) {
    return (
      <div className="border border-neutral-200 bg-white p-6 text-center text-neutral-500 shadow-sm">
        내 후기를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-neutral-900">
            나의 후기
          </h2>
          <p className="text-gray-500 mt-1">
            작성한 후기 {reviews.length}개 · 평균 평점 {averageRating}
          </p>
        </div>

        <select
          className="border rounded px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="high">평점 높은순</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div
            key={review.reviewId}
            className="border rounded-lg p-5 bg-gray-50 flex gap-4"
          >
            <div className="w-28 h-24 bg-gray-200 rounded flex items-center justify-center overflow-hidden text-sm text-gray-500">
              {review.imageName ? (
                <img
                  src={getReviewImageUrl(review.imageName)}
                  alt="후기 이미지"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>이미지</span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-neutral-900">
                    Schedule ID : {review.scheduleId}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    예약번호 {review.bookingId}
                  </p>

                  <p className="text-yellow-500 mt-1">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      editReview(review.reviewId, review.rating, review.content)
                    }
                    className="border rounded px-3 py-1 hover:bg-blue-50"
                  >
                    수정
                  </button>

                  <button
                    onClick={() => removeReview(review.reviewId)}
                    className="border rounded px-3 py-1 text-red-500 hover:bg-red-50"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <p className="mt-3 text-gray-700">“{review.content}”</p>

              <p className="mt-3 text-sm text-gray-500">
                {review.createdAt?.substring(0, 10) || "-"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          작성한 후기가 없습니다.
        </div>
      )}
    </div>
  );
}

export default ReviewPage;