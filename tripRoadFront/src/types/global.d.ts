// ? **선택적 속성 -->page나 size 속성을  선택적으로 사용할 수 있도록 정의**
interface PageParam {
  page ?: string | number
  size ?: string | number
   
}

interface PageRequestDTO {
  page:number,
  size: number
}

// 인터페이스는 함수나 훅이 반환하는 객체의 타입을 정의
interface UseCustomMoveReturn {
  // moveToList 함수는 선택적 매개변수 pageParam을 받아서 페이지 이동을 처리하는 함수
  moveToList: (pageParam?: PageParam) => void
  //  숫자형 인자 tno를 받아서 호출하는 수정 페이지 이동 함수
  moveToModify: (tno:number) => void
  moveToRead: (tno:number) => void
  page: number        // 현재 페이지 번호를 나타내는 숫자형 속성
  size: number,       // 한 페이지 당 보여줄 아이템 수(크기)를 나타내는 숫자 
  refresh: boolean    // 새로고침 여부를 나타내는 논리값(true/false). 이거로 데이터를 다시 불러올지 판단
}

// todo 리스트 페이지에서 서버로부터 받아오는 페이지 정보와 데이터 리스트를 포함하는 인터페이스
interface PageResponseDTO<T> {
  dtoList: T[]              // Generic array  todoList / todoProduct...
  pageNumList: number[]     // Array of numbers, Page numbers  
  pageRequestDTO : PageRequestDTO | null // 요청 페이지 정보, page와 size를 포함하는 객체, null일 수도 있음
  prev: boolean             // Boolean indicating if there is a previous page
  next: boolean             // Boolean indicating if there is a next page
  totalCount: number        // Total count of items
  prevPage: number          // Previous page number
  nextPage: number          // Next page number
  totalPage: number         // Total number of pages
  current: number           // Current page number
}
   