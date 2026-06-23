// 일반적 정의 
interface Todo {
  tno: number
  title: string
  writer: string
  due_date: string | null 
  complete: boolean
}

// 저장시
interface TodoAdd {
  title: string,
  writer: string,
  due_date: string 
}

// 수정시 
interface TodoModify {
  tno: number,
  title: string,
  due_date: string | null,
  complete: boolean
}
  
  