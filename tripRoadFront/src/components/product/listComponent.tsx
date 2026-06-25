import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router"
import { API_SERVER_HOST } from "../../api/apiConfig"
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/pageComponent";
import {
	getAllProducts,
	getThemes
} from "../../api/productApi";

function ListComponent() {
    const { page, size, refresh, moveToList, moveToRead }: UseCustomMoveReturn = useCustomMove();
    const [searchParams, setSearchParams] = useSearchParams()
    const themeCodeParam = searchParams.get("themeCode")
    const initialThemeCode = themeCodeParam
        ? Number(themeCodeParam)
        : null
    const [serverData, setServerData] = useState<PageResponseDTO<ProductListDto> | undefined>();
    const [fullList, setFullList] = useState<ProductListDto[]>([]);
    const [themes, setThemes] = useState<Theme[]>([]);
    const [selectedTheme, setSelectedTheme] =
        useState<number | null>(
            initialThemeCode !== null &&
            !Number.isNaN(initialThemeCode)
            ? initialThemeCode
            : null
        )
    const [selectedRegion, setSelectedRegion] =
        useState<number | null>(null);
    const [keyword, setKeyword] = useState("");
    const [activeKeyword, setActiveKeyword] = useState("");

    const regions = useMemo(() => {
        const regionMap = new Map<number, string>();

        fullList.forEach((product) => {
            if (
                product.regionId !== null &&
                product.regionName
            ) {
                regionMap.set(
                    product.regionId,
                    product.regionName
                );
            }
        });

        return Array.from(
            regionMap,
            ([regionId, regionName]) => ({
                regionId,
                regionName,
            })
        ).sort((a, b) =>
            a.regionName.localeCompare(b.regionName, "ko")
        );
    }, [fullList]);

    useEffect(() => {
        const themeCodeValue = searchParams.get("themeCode");
        const regionIdValue = searchParams.get("regionId");
        const keywordValue = searchParams.get("keyword") ?? "";

        const parsedThemeCode = themeCodeValue
            ? Number(themeCodeValue)
            : null;

        const parsedRegionId = regionIdValue
            ? Number(regionIdValue)
            : null;

        setSelectedTheme(
            parsedThemeCode !== null &&
            !Number.isNaN(parsedThemeCode)
                ? parsedThemeCode
                : null
        );

        setSelectedRegion(
            parsedRegionId !== null &&
            !Number.isNaN(parsedRegionId)
                ? parsedRegionId
                : null
        );

        setKeyword(keywordValue);
        setActiveKeyword(keywordValue);
    }, [searchParams]);

    useEffect(() => {
        getThemes().then(setThemes).catch(() => {});
    }, []);

    useEffect(() => {
        getAllProducts()
            .then(setFullList)
            .catch((error: unknown) => {
                console.error(error);
                setFullList([]);
            });
    }, [refresh]);

    const filteredList = useMemo(() => {
        const normalizedKeyword =
            activeKeyword.trim().toLowerCase();

        const selectedThemeName =
            selectedTheme === null
                ? null
                : themes.find(
                        (theme) =>
                            theme.themeCode === selectedTheme
                    )?.themeName ?? null;

        return fullList.filter((product) => {
            const matchesRegion =
                selectedRegion === null ||
                product.regionId === selectedRegion;

            const matchesTheme =
                selectedTheme === null ||
                product.themeName === selectedThemeName;

            const matchesKeyword =
                !normalizedKeyword ||
                product.productName
                    .toLowerCase()
                    .includes(normalizedKeyword);

            return (
                matchesRegion &&
                matchesTheme &&
                matchesKeyword
            );
        });
    }, [
        fullList,
        selectedRegion,
        selectedTheme,
        activeKeyword,
        themes
    ]);

    useEffect(() => {
        const totalCount = filteredList.length;
        const totalPage = Math.max(1, Math.ceil(totalCount / size));
        const currentPage = Math.min(page, totalPage);
        const startIndex = (currentPage - 1) * size;
        const endIndex = startIndex + size;
        const currentList = filteredList.slice(
            startIndex,
            endIndex
        );
        const pageNumList = Array.from({ length: totalPage }, (_, idx) => idx + 1);

        setServerData({
            dtoList: currentList,
            pageNumList,
            pageRequestDTO: { page: currentPage, size },
            prev: currentPage > 1,
            next: currentPage < totalPage,
            totalCount,
            prevPage: Math.max(1, currentPage - 1),
            nextPage: Math.min(totalPage, currentPage + 1),
            totalPage,
            current: currentPage
        });
    }, [filteredList, page, size]);

    useEffect(() => {
        if (serverData) {
            const savedScroll = sessionStorage.getItem('productListScroll');
            if (savedScroll) {
                window.scrollTo(0, parseInt(savedScroll));
                sessionStorage.removeItem('productListScroll');
            }
        }
    }, [serverData]);

    const handleSearch = () => {
        const trimmedKeyword = keyword.trim();

        setActiveKeyword(trimmedKeyword);

        const nextParams =
            new URLSearchParams(searchParams);

        nextParams.set("page", "1");
        nextParams.set("size", size.toString());

        if (trimmedKeyword) {
            nextParams.set("keyword", trimmedKeyword);
        } else {
            nextParams.delete("keyword");
        }

        setSearchParams(nextParams);
    };

    const handleRegionChange = (regionId: number | null) => {
        setSelectedRegion(regionId);

        const nextParams = new URLSearchParams(searchParams);

        nextParams.set("page", "1");
        nextParams.set("size", size.toString());

        if (regionId === null) {
            nextParams.delete("regionId");
        } else {
            nextParams.set("regionId", regionId.toString());
        }

        setSearchParams(nextParams);
    };

    const handleThemeChange = (
        themeCode: number | null
    ) => {
        setSelectedTheme(themeCode);

        const nextParams =
            new URLSearchParams(searchParams);

        nextParams.set("page", "1");
        nextParams.set("size", size.toString());

        if (themeCode === null) {
            nextParams.delete("themeCode");
        } else {
            nextParams.set(
                "themeCode",
                themeCode.toString()
            );
        }

        setSearchParams(nextParams);
    };

    const handleReset = () => {
        setSelectedTheme(null)
        setKeyword("")
        setActiveKeyword("")
        setSelectedRegion(null);

        const nextParams = new URLSearchParams(searchParams)
        nextParams.set("page", "1")
        nextParams.set("size", size.toString())
        nextParams.delete("themeCode")
        nextParams.delete("keyword")
        nextParams.delete("regionId");

        setSearchParams(nextParams)
    }

    return (
        <div className="mt-10">
            <div className="border border-neutral-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row">
                    <select
                        value={selectedRegion ?? ""}
                        onChange={(e) =>
                            handleRegionChange(
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                        className="h-11 border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-sky-600"
                    >
                        <option value="">전체 지역</option>

                        {regions.map((region) => (
                            <option
                                key={region.regionId}
                                value={region.regionId}
                            >
                                {region.regionName}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedTheme ?? ""}
                        onChange={(e) =>
                            handleThemeChange(
                                e.target.value
                                    ? Number(e.target.value)
                                    : null
                            )
                        }
                        className="h-11 border border-neutral-300 bg-white px-4 text-sm outline-none focus:border-sky-600"
                    >
                        <option value="">전체 테마</option>

                        {themes.map((theme) => (
                            <option
                                key={theme.themeCode}
                                value={theme.themeCode}
                            >
                                {theme.themeName}
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="가고 싶은 여행 상품을 검색하세요"
                        className="h-11 flex-1 border border-neutral-300 px-4 text-sm outline-none focus:border-sky-600"
                    />

                    <button
                        type="button"
                        onClick={handleSearch}
                        className="h-11 bg-sky-700 px-6 text-sm font-bold text-white transition hover:bg-sky-800"
                    >
                        검색
                    </button>

                    {(
                        selectedRegion !== null ||
                        selectedTheme !== null ||
                        activeKeyword
                    ) && (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="h-11 border border-neutral-300 bg-white px-5 text-sm font-bold text-neutral-600 transition hover:bg-neutral-50"
                        >
                            초기화
                        </button>
                    )}
                </div>
            </div>

            {serverData && (
                <>
                    <div className="w-full pb-6">
                        {serverData.dtoList.length === 0 ? (
                            <div className="mt-6 w-full border border-neutral-200 bg-white px-6 py-16 text-center">
                                <div className="font-bold text-neutral-700">
                                    검색 결과가 없습니다.
                                </div>

                                <div className="mt-2 text-sm text-neutral-500">
                                    다른 테마나 상품명으로 검색해 보세요.
                                </div>
                            </div>
                            ) : (
                            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {serverData.dtoList.map((product) => (
                                    <article
                                        key={product.productId}
                                        onClick={() => {
                                            sessionStorage.setItem(
                                                "productListScroll",
                                                window.scrollY.toString()
                                            )
                                            moveToRead(product.productId)
                                        }}
                                        className="group cursor-pointer overflow-hidden border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                    >
                                        <div className="h-48 overflow-hidden bg-neutral-100">
                                        {product.imageName ? (
                                            <img
                                                src={`${API_SERVER_HOST}/api/products/view/s_${encodeURIComponent(product.imageName)}`}
                                                alt={product.productName}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                                                이미지 없음
                                            </div>
                                        )}
                                        </div>

                                        <div className="p-5">
                                            <div className="flex gap-2">
                                                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                                                    {product.regionName || "지역 미정"}
                                                </span>

                                                <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                                                    {product.themeName || "테마 미정"}
                                                </span>
                                            </div>

                                            <h2 className="mt-4 line-clamp-2 text-lg font-extrabold text-neutral-900">
                                                {product.productName}
                                            </h2>

                                            {product.averageRating !== null && (
                                                <div className="mt-2 flex items-center gap-1 text-sm">
                                                    <span className="font-extrabold text-amber-500">
                                                        ★ {Number(product.averageRating).toFixed(1)}
                                                    </span>

                                                    <span className="text-xs text-neutral-400">
                                                        평점
                                                    </span>
                                                </div>
                                            )}

                                            <div className="mt-4 flex items-end justify-between">
                                                <span className="text-xs text-neutral-400">
                                                    1인 기준
                                                </span>

                                                <span className="text-xl font-extrabold text-red-500">
                                                    {product.price?.toLocaleString()}원
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                    <PageComponent serverData={serverData} movePage={moveToList} />
                </>
            )}
        </div>
    );
}

export default ListComponent;
