import { useEffect, useState } from "react";
import { useSearchParams } from "react-router"
import useCustomMove from "../../hooks/useCustomMove";
import PageComponent from "../common/pageComponent";
import { getList, getProductsByTheme, getThemes, searchProduct } from "../../api/productApi";

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
    const [keyword, setKeyword] = useState("");
    const [activeKeyword, setActiveKeyword] = useState("");
    useEffect(() => {
        const themeCodeValue = searchParams.get("themeCode")
        const keywordValue = searchParams.get("keyword") ?? ""

        const parsedThemeCode = themeCodeValue
            ? Number(themeCodeValue)
            : null

        setSelectedTheme(
            parsedThemeCode !== null &&
            !Number.isNaN(parsedThemeCode)
            ? parsedThemeCode
            : null
        )

        setKeyword(keywordValue)
        setActiveKeyword(keywordValue)
    }, [searchParams])

    useEffect(() => {
        getThemes().then(setThemes).catch(() => {});
    }, []);

    useEffect(() => {
        let fetchPromise: Promise<ProductListDto[]>;

        if (activeKeyword) {
            fetchPromise = searchProduct(activeKeyword);
        } else if (selectedTheme !== null) {
            fetchPromise = getProductsByTheme(selectedTheme);
        } else {
            fetchPromise = getList({ page, size });
        }

        fetchPromise
            .then(setFullList)
            .catch(e => {
                console.error(e);
                setFullList([]);
            });
    }, [selectedTheme, activeKeyword, refresh, page, size])

    useEffect(() => {
        const totalCount = fullList.length;
        const totalPage = Math.max(1, Math.ceil(totalCount / size));
        const currentPage = Math.min(page, totalPage);
        const startIndex = (currentPage - 1) * size;
        const endIndex = startIndex + size;
        const currentList = fullList.slice(startIndex, endIndex);
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
    }, [fullList, page, size]);

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
        const trimmedKeyword = keyword.trim()

        setSelectedTheme(null)
        setActiveKeyword(trimmedKeyword)

        const nextParams = new URLSearchParams(searchParams)
        nextParams.set("page", "1")
        nextParams.set("size", size.toString())
        nextParams.delete("themeCode")

        if (trimmedKeyword) {
            nextParams.set("keyword", trimmedKeyword)
        } else {
            nextParams.delete("keyword")
        }

        setSearchParams(nextParams)
    }

    const handleThemeChange = (themeCode: number | null) => {
        setSelectedTheme(themeCode)
        setKeyword("")
        setActiveKeyword("")

        const nextParams = new URLSearchParams(searchParams)
        nextParams.set("page", "1")
        nextParams.set("size", size.toString())
        nextParams.delete("keyword")

        if (themeCode === null) {
            nextParams.delete("themeCode")
        } else {
            nextParams.set("themeCode", themeCode.toString())
        }

        setSearchParams(nextParams)
    }

    const handleReset = () => {
        setSelectedTheme(null)
        setKeyword("")
        setActiveKeyword("")

        const nextParams = new URLSearchParams(searchParams)
        nextParams.set("page", "1")
        nextParams.set("size", size.toString())
        nextParams.delete("themeCode")
        nextParams.delete("keyword")

        setSearchParams(nextParams)
    }

    return (
        <div className="border-2 border-blue-100 mt-10 mr-2 ml-2">
            <div className="flex gap-2 p-4 flex-wrap items-center">
                <select
                    value={selectedTheme ?? ""}
                    onChange={(e) => handleThemeChange(e.target.value ? Number(e.target.value) : null)}
                    className="border rounded p-2 text-base"
                >
                    <option value="">전체 테마</option>
                    {themes.map(t => (
                        <option key={t.themeCode} value={t.themeCode}>{t.themeName}</option>
                    ))}
                </select>

                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="상품명 검색"
                    className="border rounded p-2 text-base flex-1 min-w-[200px]"
                />

                <button
                    type="button"
                    onClick={handleSearch}
                    className="rounded px-4 py-2 bg-blue-500 text-white text-base"
                >
                    검색
                </button>

                {(selectedTheme !== null || activeKeyword) && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="rounded px-4 py-2 bg-gray-400 text-white text-base"
                    >
                        초기화
                    </button>
                )}
            </div>

            {serverData && (
                <>
                    <div className="flex flex-wrap mx-auto justify-center p-6">
                        {serverData.dtoList.length === 0 ? (
                            <div className="p-10 text-gray-500">검색 결과가 없습니다.</div>
                        ) : (
                            serverData.dtoList.map(product => (
                                <div
                                    key={product.productId}
                                    className="w-full min-w-[400px] p-2 m-2 rounded shadow-md border border-gray-200 cursor-pointer hover:shadow-lg"
                                    onClick={() => {
                                        sessionStorage.setItem('productListScroll', window.scrollY.toString());
                                        moveToRead(product.productId);
                                    }}
                                >
                                    <div className="flex">
                                        <div className="text-lg m-1 p-2 w-5/12 font-extrabold">
                                            {product.productName}
                                        </div>
                                        <div className="text-lg m-1 p-2 w-2/12 font-medium">
                                            {product.themeName || "-"}
                                        </div>
                                        <div className="text-lg m-1 p-2 w-3/12 font-medium text-right">
                                            ₩ {product.price?.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <PageComponent serverData={serverData} movePage={moveToList} />
                </>
            )}
        </div>
    );
}

export default ListComponent;
