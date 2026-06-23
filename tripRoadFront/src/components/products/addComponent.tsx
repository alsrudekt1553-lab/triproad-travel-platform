import axios from "axios"
import { API_SERVER_HOST } from "../../api/todoApi"
import { useActionState } from "react"
import useCustomMove from "../../hooks/useCustomMove"
import ResultModal from "../common/resultModal"
import PendingModal from "../common/pendingModal"


//  ProductAddResult 인터페이스 정의 --> 데이터 구조를 정의
interface ProductAddResult {
  result : number,
  error? : string // 에러 메시지 선택적 속성
}

// ProductAddResult 인터페이스 형태를 따라야 한다고 명시
const initState: ProductAddResult = {
  result: 0,
  error: ''
}

// 액션처리 함수 
// 1. addAsyncAction이라는 비동기(async) 함수를 정의. async 키워드가 있으니까 이 함수 안에서 await를 사용가능 .
// 2. state: ProductAddResult: 첫 번째 인자는 state인데, 현재 상태를 나타냄. 여기서는 ProductAddResult 형태
// 3. formData: FormData: 두 번째 인자는 formData인데, <form> 태그에서 제출된 데이터들을 담고 있는 특별한 객체. 이 데이터는 FormData 객체로 전달.
// 4. 이 함수는 Promise를 반환하는데, 이 Promise는 ProductAddResult 형태의 데이터를 반환
// 5. 이 함수는 상품을 추가하는 비동기 작업을 수행하고, 성공하면 결과를 반환.
// 6. 만약 상품 이름이 없으면 에러 메시지를 반환하고, 그렇지 않으면 백엔드 서버에 상품 등록 요청을 보냄.
// 7. 서버로부터 응답을 받으면, 그 응답의 결과를 반환.
const addAsyncAction = async (_state:ProductAddResult, formData:FormData ) => {

    console.log("addAsyncAction........")

    await new Promise(resolve => setTimeout(resolve, 1000))

    const pname = formData.get("pname") as string 
    if(!pname) {
        return { result:0, error: "Insert Product Name"}
    }
    // 백엔드 서버의 상품 등록 API 엔드포인트 URL
    const res = await axios.post(`${API_SERVER_HOST}/api/products/register`, formData )

    return {result: res.data.result}


}



function AddComponent() {
    // useActionState는 비동기 작업을 처리하는 훅으로, addAsyncAction 함수를 사용하여 상태를 관리
    // initState는 초기 상태로, ProductAddResult 형태의 객체를 사용
    // state는 현재 상태를 나타내고, action은 액션을 처리하는 함수, isPending은 비동기 작업이 진행 중인지 여부를 나타내
    // form에서의 {action}은 action 함수로, 이 함수를 호출하면 addAsyncAction이 실행되어 비동기 작업을 처리
    //  action 함수가 폼 데이터를 자동으로 수집해서 addAsyncAction에 전달
    //  isPending 상태가 true로 바뀌어 로딩 표시(PendingModal)가 화면에 나오고, 작업이 완료되면 결과(ResultModal)가 표시 
    //  =====      <<< useActionState는 세 가지 값을 반환 상세요소 >>>    ===== 
    //  1. state: 액션 함수의 결과값. (addAsyncAction이 반환하는 { result: number, error?: string } 객체가 여기에 담김.)
    //  2. action: <form> 태그의 action 속성에 바로 연결해서 사용할 수 있는 함수. (폼 제출을 트리거함)
    //  3. isPending: 액션이 현재 처리 중인지 (true) 아닌지 (false)를 알려주는 불리언 값
    const [state, action ,isPending] = useActionState(addAsyncAction, initState)

    const {moveToList} = useCustomMove()

    const closeModal = () => {
            moveToList()
    }

    return (
    <div className = "border-2 border-sky-200 mt-10 m-2 p-4">
        {isPending && <PendingModal/>}

        {state.result !== 0 && 
        <ResultModal 
            title="상품 추가 결과" 
            content={`새로운 ${state.result} 상품 추가됨`} 
            callbackFn={closeModal}/>
        } 

        <h1>Add Component</h1>

        <form action={action}>
            {/* Product Name Row */}
            <div className="flex justify-center mt-7">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-2 text-sm text-right font-bold">Product Name</div> {/* p-6 -> p-2, text-sm 추가 */}
                    <input className="w-4/5 p-2 rounded-r border border-solid border-neutral-300 shadow-md" 
                        name="pname" required>
                    </input>
                </div>
            </div>
            {/* Desc Row */}
            <div className="flex justify-center">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-2 text-sm text-right font-bold">Desc</div> {/* p-6 -> p-2, text-sm 추가 */}
                    <textarea 
                    className="w-4/5 p-2 rounded-r border border-solid border-neutral-300 shadow-md resize-y"  
                    name="pdesc" rows={2} required> {/* rows={3} -> rows={2} (원한다면) */}
                    </textarea>
                </div> 
            </div>
            {/* Price Row */}
            <div className="flex justify-center">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-2 text-sm text-right font-bold">Price</div> {/* p-6 -> p-2, text-sm 추가 */}
                    <input 
                        className="w-4/5 p-2 rounded-r border border-solid border-neutral-300 shadow-md"  
                        name="price" type={'number'} required>
                    </input>
                </div>
            </div>
            {/* Files Row */}
            <div className="flex justify-center">
                <div className="relative mb-2 flex w-full flex-wrap items-stretch"> {/* mb-4 -> mb-2 */}
                    <div className="w-1/5 p-2 text-sm text-right font-bold">Files</div> {/* p-6 -> p-2, text-sm 추가 */}
                    <input
                        className="w-4/5 p-2 rounded-r border border-solid border-neutral-300 shadow-md"  
                        type={'file'}
                        name="files"
                        multiple={true}> 
                    </input>
                </div>
            </div>
            {/* Button Row */}
            <div className="flex justify-end">
                <div className="relative mb-4 flex p-3 flex-wrap items-stretch"> {/* p-4 -> p-3 (아래쪽 마진은 유지해도 괜찮고 더 줄여도 됨) */}
                    <button type="submit" 
                        className="rounded p-3 w-32 bg-blue-500 text-lg text-white"> {/* p-4 -> p-3, w-36 -> w-32, text-xl -> text-lg */}
                        ADD
                    </button>  
                </div>
            </div>
        </form>
    </div>
    )





}

export default AddComponent;