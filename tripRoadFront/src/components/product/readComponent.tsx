import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { getReviewImages } from "../../api/reviewImageApi";
import { useNavigate } from "react-router";
import { API_SERVER_HOST } from "../../api/apiConfig";
import { getOne, getReviews } from "../../api/productApi";
import { getWishlists, toggleWishlist } from "../../api/myPageApi";

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
  const [wished, setWished] = useState(false);
  const [_wishlistId, setWishlistId] = useState<number | null>(null);

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

    const userId = sessionStorage.getItem("USER_ID");
    if (userId) {
      getWishlists(Number(userId)).then((res) => {
        const found = res.data.find((w: any) => w.productId === productId);
        if (found) {
          setWished(true);
          setWishlistId(found.wishlistId);
        }
      });
    }
  }, [productId]);

  if (error) return <ErrorScreen onMove={moveToList} />;

  const averageRating =
    reviews.length === 0
      ? "0.0"
      : (
          reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
          reviews.length
        ).toFixed(1);

  const moveReviewPage = () => {
  navigate(`/review/product/${productId}`);
};

  return (
    <>
      {product && (
        <div className="w-full">
          <div className="overflow-hidden border border-neutral-200 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-neutral-100">
                {product.imageNames?.length > 0 ? (
                  <ImageSlider imageNames={product.imageNames} />
                ) : (
                  <div className="flex min-h-80 items-center justify-center text-neutral-400">
                    이미지 없음
                  </div>
                )}
              </div>

              <div className="relative flex flex-col p-7">
                <button
                  type="button"
                  onClick={() => {
                    const userId = sessionStorage.getItem("USER_ID");
                    if (!userId) { navigate("/user01/login"); return; }
                    toggleWishlist({ userId: Number(userId), productId }).then((res) => {
                      setWished(res.data.wished);
                      setWishlistId(res.data.wishlistId ?? null);
                    });
                  }}
                  className="absolute top-4 right-4"
                >
                  {wished ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#e53e3e">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  )}
                </button>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                    {product.regionName || "지역 미정"}
                  </span>

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    {product.themeName || "테마 미정"}
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-extrabold text-neutral-900">
                  {product.productName}
                </h1>

                <div className="mt-3 flex items-center gap-3">
                  {reviews.length > 0 && (
                    <span className="font-extrabold text-amber-500">
                      ★ {averageRating}
                    </span>
                  )}

                  <span className="text-sm text-neutral-500">
                    후기 {reviews.length}개
                  </span>
                </div>

                <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-neutral-600">
                  {product.description}
                </p>

                <div className="mt-auto border-t border-neutral-200 pt-6">
                  <div className="text-xs text-neutral-500">
                    1인 기준
                  </div>

                  <div className="mt-1 text-3xl font-extrabold text-red-500">
                    {product.price?.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          </div>

          {product.schedules && product.schedules.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-4 text-xl font-extrabold text-neutral-900">
                예약 가능한 일정
              </h2>

              <div className="space-y-3">
                {product.schedules.map((schedule) => {
                  const available = schedule.status === 1

                  return (
                    <article
                      key={schedule.scheduleId}
                      className="flex flex-col gap-4 border border-neutral-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-neutral-900">
                            {schedule.title}
                          </h3>

                          <span
                            className={
                              available
                                ? "rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-700"
                                : "rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-500"
                            }
                          >
                            {available ? "예약 가능" : "예약 마감"}
                          </span>
                        </div>

                        <div className="mt-2 text-sm text-neutral-500">
                          {schedule.startDate} ~ {schedule.endDate}
                        </div>

                        <div className="mt-1 text-xs text-neutral-400">
                          최대 {schedule.maxHeadcount ?? "미정"}명
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!available}
                        onClick={() =>
                          navigate(
                            `/booking/hold/${schedule.scheduleId}`,
                            {
                              state: {
                                productName: product.productName,
                                unitPrice: product.price,
                                departureDate: schedule.startDate
                              }
                            }
                          )
                        }
                        className="rounded-full bg-sky-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                      >
                        예약하기
                      </button>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {(!product.schedules ||
            product.schedules.length === 0) && (
            <div className="mt-8 border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
              현재 예약 가능한 일정이 없습니다.
            </div>
          )}

          <section className="mt-8">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-neutral-900">
                  여행 후기
                </h2>

                <div className="mt-1 flex items-center gap-2 text-sm">
                  {reviews.length > 0 && (
                    <span className="font-extrabold text-amber-500">
                      ★ {averageRating}
                    </span>
                  )}

                  <span className="text-neutral-500">
                    총 {reviews.length}개의 후기
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={moveReviewPage}
                className="rounded-full border border-sky-700 bg-white px-5 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-50"
              >
                후기 전체보기
              </button>
            </div>

            {reviewError ? (
              <div className="border border-neutral-200 bg-white px-6 py-12 text-center text-sm text-neutral-500">
                후기를 불러오지 못했습니다.
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.slice(0, 3).map((review) => (
                  <article
                    key={review.reviewId}
                    className="border border-neutral-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-amber-500">
                        {"★".repeat(review.rating)}
                        <span className="text-neutral-300">
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </span>

                      <span className="text-xs text-neutral-400">
                        {review.createdAt}
                      </span>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-neutral-700">
                      {review.content}
                    </p>

                    {(imageMap[review.reviewId] ?? []).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {(imageMap[review.reviewId] ?? []).map(
                          (imageName) => (
                            <img
                              key={imageName}
                              src={`${API_SERVER_HOST}/api/reviewImage/view/${imageName}`}
                              alt="후기 이미지"
                              className="h-28 w-28 object-cover"
                            />
                          )
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="border border-neutral-200 bg-white px-6 py-12 text-center">
                <div className="font-bold text-neutral-700">
                  등록된 후기가 없습니다.
                </div>

                <div className="mt-2 text-sm text-neutral-500">
                  여행을 다녀온 회원의 첫 후기를 기다리고 있습니다.
                </div>
              </div>
            )}
          </section>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => moveToList()}
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-bold text-neutral-700 transition hover:border-sky-700 hover:text-sky-700"
            >
              목록으로
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ReadComponent;
