import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_SERVER_HOST } from "../../api/apiConfig";
import {
    getWishlists,
    deleteWishlist as deleteWishlistApi,
} from "../../api/myPageApi";
import { formatDate } from "../../utils/dateFormat";

type WishlistPageProps = {
    userId: number;
};

type Wishlist = {
    wishlistId: number;
    userId: number;
    productId: number;
    productName: string;
    price: number;
    createdAt: string;
    imageName?: string;
};

function WishlistPage({ userId }: WishlistPageProps) {
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getWishlists(userId).then((res) => {
            console.log("찜목록:", res.data);
            setWishlists(res.data);
        })
            .catch((err) => {
                console.log("찜목록 조회 실패:", err);
            });
    }, [userId]);

    const deleteWishlist = async (wishlistId: number) => {
    if (!confirm("찜 목록에서 삭제하시겠습니까?")) return;

    try {
        await deleteWishlistApi(wishlistId);

        setWishlists(
            wishlists.filter(
                (wishlist) => wishlist.wishlistId !== wishlistId
            )
        );

        alert("찜 목록에서 삭제되었습니다.");
    } catch (err) {
        console.log("찜 삭제 실패:", err);
        alert("찜 삭제에 실패했습니다.");
    }
};

    return (
        <div className="border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-extrabold text-neutral-900">
                    찜 목록
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                    관심 있는 여행 패키지를 모아보세요.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {wishlists.map((wishlist) => (
                    <div
                        key={wishlist.wishlistId}
                        className="overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                            {wishlist.imageName ? (
                                <img
                                    src={`${API_SERVER_HOST}/api/products/view/${wishlist.imageName}`}
                                    alt={wishlist.productName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span>사진</span>
                            )}
                        </div>

                        <div className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        상품번호 {wishlist.productId}
                                    </p>

                                    <h3 className="text-xl font-bold mt-1">
                                        {wishlist.productName}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteWishlist(wishlist.wishlistId)
                                    }
                                    className="shrink-0"
                                    aria-label="찜 목록에서 삭제"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="32"
                                        height="32"
                                        viewBox="0 0 24 24"
                                        fill="#e53e3e"
                                    >
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </button>
                            </div>

                            <p className="font-bold mt-3">
                                {wishlist.price.toLocaleString()}원
                            </p>

                            <p className="text-gray-500 mt-2">
                                찜한 날짜: {formatDate(wishlist.createdAt)}
                            </p>

                            <button
                                onClick={() => navigate(`/product/read/${wishlist.productId}`)}
                                className="mt-4 w-full bg-sky-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-sky-800"
                            >
                                상세보기
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {wishlists.length === 0 && (
                <div className="text-center text-gray-500 py-20">
                    찜한 패키지가 없습니다.
                </div>
            )}
        </div>
    );
}

export default WishlistPage;