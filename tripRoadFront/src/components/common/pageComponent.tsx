interface  PageComponentProps<T> {
  // PageResponseDTO<T> 타입의 데이터를 받아오는 prop
  // Props는 리액트(React)에서 컴포넌트에게 전달하는 데이터 또는 속성을 의미
  // --> 컴포넌트가 부모로부터 받는 입력값 
   serverData: PageResponseDTO<T> | undefined,
  // PageParam 타입의 객체를 받아서 (그 안에 page 속성) 페이지를 이동시키는 함수를 전달받는 prop
  // movePage 함수는 페이지 번호를 변경하는 역할을 함
  // PageParam 타입은 페이지 번호와 크기를 나타내는 속성을 가짐
  // PageParam 타입은 페이지 번호와 크기를 나타내는 속성을 가짐
  // 반환값은 없으니까 void 타입
   movePage: ({page}:PageParam) => void 
}

function PageComponent<T>({ serverData, movePage }: PageComponentProps<T>   ) {
    return ( 
        <div className="m-6 flex justify-center">
            { 
            serverData?.prev &&
            <div 
            className="m-2 p-2 w-16 text-center font-bold text-blue-400 "
            onClick={() => movePage({page:serverData.prevPage} )}>
                    Prev 
            </div>

            }

            {serverData?.pageNumList.map(pageNum => 
                <div 
                key={pageNum}
                className={ `m-2 p-2 w-12 text-center rounded shadow-md text-white ${serverData.current === pageNum? 'bg-gray-500':'bg-blue-400'}`}
                onClick={() => movePage( {page:pageNum})}>
                    {pageNum}
                </div>
            )}

            {serverData?.next && 
                <div 
                className="m-2 p-2 w-16 text-center font-bold text-blue-400"
                onClick={() => movePage( {page:serverData.nextPage})}> 
                    Next 
                </div>
            } 

        </div>

     );
}

export default PageComponent;