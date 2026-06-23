import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    getWishlists,
    deleteWishlist as deleteWishlistApi,
} from "../../api/myPageApi";

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
        <div className="bg-white border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">찜 목록</h2>

            <div className="grid grid-cols-2 gap-6">
                {wishlists.map((wishlist) => (
                    <div
                        key={wishlist.wishlistId}
                        className="border rounded-lg overflow-hidden bg-gray-50"
                    >
                        <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                            {wishlist.imageName ? (
                                <img
                                    src={`http://localhost:8587/api/products/view/${wishlist.imageName}`}
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
                                    onClick={() =>
                                        deleteWishlist(wishlist.wishlistId)
                                    }
                                    className="text-2xl"
                                >
                                    💗
                                </button>
                            </div>

                            <p className="font-bold mt-3">
                                {wishlist.price.toLocaleString()}원
                            </p>

                            <p className="text-gray-500 mt-2">
                                찜한 날짜: {wishlist.createdAt || "-"}
                            </p>

                            <button
                                onClick={() => navigate(`/product/read/${wishlist.productId}`)}
                                className="mt-4 border rounded px-4 py-2 hover:bg-blue-50"
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