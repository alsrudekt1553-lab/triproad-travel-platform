import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { getReviewImages } from "../../api/reviewImageApi";
import { useNavigate } from "react-router";
import { API_SERVER_HOST } from "../../api/apiConfig";
import { getOne, getReviews } from "../../api/productApi";

function ErrorScreen({ onMove }: { onMove: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onMove();
      return;
    }

    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onMove]);

  return (
    <div className="mt-10 m-2 p-10 text-center border-2 border-red-200 rounded">
      <div className="text-2xl text-red-500 mb-4">
        상품 정보를 불러올 수 없습니다.
      </div>
      <div className="text-gray-500 mb-6">
        {count}초 후 목록으로 이동합니다.
      </div>
      <button
        type="button"
        className="rounded p-3 px-6 text-lg text-white bg-blue-500"
        onClick={onMove}
      >
        목록으로 이동
      </button>
    </div>
  );
}

function ImageSlider({ imageNames }: { imageNames: string[] }) {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((i) => (i === 0 ? imageNames.length - 1 : i - 1));

  const next = () =>
    setCurrent((i) => (i === imageNames.length - 1 ? 0 : i + 1));

  if (imageNames.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={`${API_SERVER_HOST}/api/products/view/${imageNames[current]}`}
          alt={`product-${current}`}
          className="w-full h-full object-cover"
        />

        {imageNames.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-opacity-70"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-opacity-70"
            >
              ›
            </button>
          </>
        )}
      </div>

      {imageNames.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {imageNames.map((imageName, i) => (
            <img
              key={i}
              src={`${API_SERVER_HOST}/api/products/view/${imageName}`}
              alt={`thumb-${i}`}
              onClick={() => setCurrent(i)}
              className={`w-20 h-20 object-cover rounded cursor-pointer flex-shrink-0 border-2 ${
                i === current ? "border-blue-500" : "border-transparent"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReadComponent({ productId }: { productId: number }) {
  const { moveToList } = useCustomMove();

  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetailDto | undefined>();
  const [reviews, setReviews] = useState<ProductReviewDto[]>([]);
  const [imageMap, setImageMap] = useState<Record<number, string[]>>({});
  const [error, setError] = useState(false);
  const [reviewError, setReviewError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    getOne(productId)
      .then((data) => setProduct(data))
      .catch(() => setError(true));

    getReviews(productId)
      .then(async (data) => {
        setReviews(data);
        const entries = await Promise.all(
          data.map(async (r: ProductReviewDto) => {
            const images = await getReviewImages(r.reviewId).catch(() => []);
            return [r.reviewId, images.map((img: { imageName: string }) => img.imageName)] as [number, string[]];
          })
        );
        setImageMap(Object.fromEntries(entries));
      })
      .catch(() => setReviewError(true));
  }, [productId]);

  if (error) return <ErrorScreen onMove={moveToList} />;

  const averageRating =
    reviews.length === 0
      ? "0.0"
      : (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1);

  const firstScheduleId = product?.schedules?.[0]?.scheduleId;

  const moveReviewPage = () => {
    if (!firstScheduleId) {
      alert("연결된 일정이 없습니다.");
      return;
    }

    navigate(`/review/schedule/${firstScheduleId}`);
  };

  return (
    <>
      {product && (
        <div className="border-2 border-sky-200 mt-10 m-2 p-4 text-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-4xl">{product.productName}</div>

            <div className="text-lg text-yellow-500 font-bold">
              ★ {averageRating}
            </div>

            <div className="text-base text-gray-500">
              후기 {reviews.length}개
            </div>
          </div>

          {product.imageNames && product.imageNames.length > 0 && (
            <ImageSlider imageNames={product.imageNames} />
          )}

          {makeDiv("상품명", product.productName)}
          {makeDiv("가격", `₩ ${product.price?.toLocaleString()}`)}
          {makeDiv("테마", product.themeName || "-")}
          {makeDiv("지역", product.regionName || "-")}
          {makeDiv("설명", product.description)}

          {product.schedules && product.schedules.length > 0 && (
            <div className="flex justify-center">
              <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <div className="w-1/5 p-6 text-right font-bold">일정</div>

                <div className="w-4/5 p-2">
                  <table className="w-full border text-base">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2">출발일</th>
                        <th className="border p-2">종료일</th>
                        <th className="border p-2">제목</th>
                        <th className="border p-2">최대인원</th>
                        <th className="border p-2">상태</th>
                        <th className="border p-2">예약</th>
                      </tr>
                    </thead>

                    <tbody>
                      {product.schedules.map((s) => (
                        <tr key={s.scheduleId}>
                          <td className="border p-2 text-center">
                            {s.startDate}
                          </td>

                          <td className="border p-2 text-center">
                            {s.endDate}
                          </td>

                          <td className="border p-2">{s.title}</td>

                          <td className="border p-2 text-center">
                            {s.maxHeadcount != null
                              ? `${s.maxHeadcount}명`
                              : "미정"}
                          </td>

                          <td className="border p-2 text-center">
                            {s.status === 1 ? "판매중" : "마감"}
                          </td>

                          <td className="border p-2 text-center">
                            <button
                              type="button"
                              disabled={s.status !== 1}
                              className={`rounded px-3 py-1 text-sm text-white ${
                                s.status === 1
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-300 cursor-not-allowed"
                              }`}
                              onClick={() =>
                                navigate(`/booking/hold/${s.scheduleId}`, {
                                  state: {
                                    productName: product.productName,
                                    unitPrice: product.price,
                                    departureDate: s.startDate,
                                  },
                                })
                              }
                            >
                              예약하기
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
              <div className="w-1/5 p-6 text-right font-bold">후기</div>

              <div className="w-4/5 p-2">
                <div className="border rounded p-4 mb-3 bg-gray-50 flex justify-between items-center">
                  <div>
                    <div className="text-lg font-bold text-yellow-500">
                      ★ {averageRating}
                    </div>
                    <div className="text-sm text-gray-500">
                      총 {reviews.length}개의 후기
                    </div>
                  </div>

                  <button
                    type="button"
                    className="rounded px-4 py-2 bg-blue-500 text-white text-base"
                    onClick={moveReviewPage}
                  >
                    후기 전체보기
                  </button>
                </div>

                {reviewError ? (
                  <div className="p-4 text-gray-500">
                    후기를 불러오지 못했습니다.
                  </div>
                ) : reviews.length > 0 ? (
                  reviews.slice(0, 3).map((r) => (
                    <div
                      key={r.reviewId}
                      className="border rounded p-4 mb-2 shadow-sm"
                    >
                      <div className="flex justify-between text-base text-gray-500 mb-1">
                        <span>
                          {"★".repeat(r.rating)}
                          {"☆".repeat(5 - r.rating)}
                        </span>
                        <span>{r.createdAt}</span>
                      </div>

                      <div className="text-base">{r.content}</div>

                      {(imageMap[r.reviewId] ?? []).map((imageName) => (
                        <img
                          key={imageName}
                          src={`${API_SERVER_HOST}/api/reviewImage/view/${imageName}`}
                          alt="review"
                          className="mt-2 rounded w-32 h-32 object-cover"
                        />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-500">
                    등록된 후기가 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end p-4">
            <button
              type="button"
              className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
              onClick={() => moveToList()}
            >
              목록
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function makeDiv(label: string, value: string | number | boolean) {
  return (
    <div className="flex justify-center">
      <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <div className="w-1/5 p-6 text-right font-bold">{label}</div>
        <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
          {value}
        </div>
      </div>
    </div>
  );
}

export default ReadComponent;
