// 페이지 네비게이션 유틸리티 함수들을 모아둔 커스텀 훅 
// UseCustomMoveReturn 정확히 그 함수가 반환할 타입을 정의
// 코드를 더 안전하게 작성할 수 있고, 자동완성 같은 IDE 기능도 제공

import { useState } from "react";
import { createSearchParams, useNavigate, useSearchParams } from "react-router";

// TypeScript에서는 함수가 어떤 값을 반환하는지 명확하게 알려주기 위해 이런 반환 타입을 정의
function useCustomMove():UseCustomMoveReturn {

    const navigate                = useNavigate();
    const [queryParams]           = useSearchParams();
    const [refresh, setRefresh]   = useState<boolean>(false);
    const pageStr: string | null  = queryParams.get('page');
    const sizeStr: string | null  = queryParams.get('size');

    const page: number = pageStr ? parseInt(pageStr) : 1; // page가 없으면 기본값 1
    const size: number = sizeStr ? parseInt(sizeStr) : 10; // size가 없으면 기본값 10

    //page=1&size=10
    const queryDefault = createSearchParams({page: page.toString(), 
                                              size: size.toString()}
                                            ).toString();


    const moveToRead = (tno: number) => {
        navigate({
            pathname: `../read/${tno}`,
            search: queryParams.toString()
        })
    }

    const moveToModify = (tno: number) => {
        navigate({
            pathname: `../modify/${tno}`,
            search: queryParams.toString()
        })
    }

    const moveToList = (pageParam?: PageParam) => {
    const pageNum = pageParam
        ? Number(pageParam.page) || 1
        : page

    const sizeNum = pageParam
        ? Number(pageParam.size) || 10
        : size

    const nextParams = new URLSearchParams(queryParams)

    nextParams.set("page", pageNum.toString())
    nextParams.set("size", sizeNum.toString())

    const queryStr = nextParams.toString()

    if (queryStr === queryDefault) {
        setRefresh(!refresh)
    }

    navigate({
        pathname: "../list",
        search: queryStr
    })
    }


    return {page, size, refresh, moveToList, moveToRead, moveToModify};
}

export default useCustomMove;