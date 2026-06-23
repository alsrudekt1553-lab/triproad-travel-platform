import { useActionState, useState } from "react"
import type { MouseEvent } from 'react'; // 이 부분을 추가
import useCustomMove from "../../hooks/useCustomMove"
import PendingModal from "../common/pendingModal"
import ResultModal from "../common/resultModal"
import axios from "axios"
import { API_SERVER_HOST } from "../../api/todoApi"

interface ProductTaskResult {
  actionType: string,
  result: string,
  error? : string 
}
  
const initState: ProductTaskResult = {
  actionType: 'modify',
  result: ""
}

const modifyDeleteAsyncAction = async(_state: ProductTaskResult, formData:FormData) => {

  const pno = formData.get("pno") as string
  const actionType = formData.get("actionType") as string

  console.log('pno->',pno)
  console.log('actionType->',actionType)

  let res;
  if(actionType ==='modify'){
    // console.log('modifyDeleteAsyncAction product formData->',formData)
    res = await axios.put(`${API_SERVER_HOST}/api/products/modify/${pno}`, formData )

  }else if(actionType ==='delete') {
    console.log('modifyDeleteAsyncAction product delete pno->',pno)
    res = await axios.delete(`${API_SERVER_HOST}/api/products/remove/${pno}` )
  }
  return { actionType: actionType, result: res?.data?.RESULT}
}




function ModifyComponent({product}: {product:ProductDTO}) {
    
  const [state, action, isPending] = useActionState(modifyDeleteAsyncAction, initState)
  const {moveToList, moveToRead} = useCustomMove()
  const [images, setImages] = useState<string[]>(product.uploadFileNames)

  // 버튼 클릭 이벤트를 받아서 처리하는 함수
  // 이 함수는 이벤트 객체와 삭제할 이미지의 파일명을 인자로 받음
  // 1. event: MouseEvent<HTMLButtonElement> - 버튼 클릭 이벤트를 받아서 처리하는 함수. 
  //    타입스크립트로 버튼 요소의 마우스 이벤트로 타입을 지정했어.
  // 2. target: string - 삭제하려는 이미지의 식별자(경로나 ID 같은)를 문자열
  const deleteOldImages = (event: MouseEvent<HTMLButtonElement> ,  target: string) => {

    // 이벤트의 기본 동작을 방지하고, 이벤트 전파를 중단
    event.preventDefault()
    // 이벤트가 상위 요소로 전파(버블링)되는 것을 막아줘. 이미지 삭제 버튼이 다른 클릭 가능한 요소 안에 있을 때 유용
    event.stopPropagation()
    // useState 훅으로 관리하는 상태 업데이트 함수
    // prev는 현재 이미지 배열 상태
    // filter 메소드로 target과 일치하지 않는 이미지들만 남겨서 새 배열을 만들어
    // 결과적으로 target과 일치하는 이미지는 배열에서 제거
    setImages(prev => prev.filter(img => img !== target));
  }

  return (
      <div className = "border-2 border-sky-200 mt-10 m-2 p-4 bg-white">

        {isPending && <PendingModal/>}

        {state.result && 
          <ResultModal 
                title={`${state.actionType} 처리`}   
                content={`${product.pno} PNO ${state.actionType} 처리 완료`}  
                callbackFn={() => {
                  if(state.actionType === 'modify'){
                    moveToRead(product.pno)
                  }
                  if(state.actionType === 'delete') {
                    moveToList()
                  }
                }}
          />
        } 

        <form action={action}>
          <div className="flex justify-center mt-8">
            <div className="relative mb-1 flex w-full flex-wrap items-stretch">
              <div className="w-1/5 p-3 text-right font-bold">PNO</div>
              <input className="w-4/5 p-3 rounded-r border border-solid border-neutral-300 shadow-md bg-gray-100" 
                name="pno" 
                readOnly
                defaultValue={product.pno}>
              </input>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative mb-1 flex w-full flex-wrap items-stretch">
              <div className="w-1/5 p-3 text-right font-bold">PNAME</div>
              <input className="w-4/5 p-3 rounded-r border border-solid border-neutral-300 shadow-md" 
                name="pname" required defaultValue={product.pname}>
              </input>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative mb-1 flex w-full flex-wrap items-stretch">
              <div className="w-1/5 p-3 text-right font-bold">PRICE</div>
              <input className="w-4/5 p-3 rounded-r border border-solid border-neutral-300 shadow-md" 
                name="price" type={'number'} defaultValue={product.price}>
              </input>
            </div> 
          </div>
          <div className="flex justify-center">
            <div className="relative mb-1 flex w-full flex-wrap items-stretch">
              <div className="w-1/5 p-3 text-right font-bold">PDESC</div>
              <textarea className="w-4/5 p-3 rounded-r border border-solid border-neutral-300 shadow-md resize-y"
                name="pdesc" rows={3} required defaultValue={product.pdesc}>
              </textarea>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative mb-1 flex w-full flex-wrap items-stretch">
              <div className="w-1/5 p-3 text-right font-bold">Files</div>
              <input className="w-4/5 p-3 rounded-r border border-solid border-neutral-300 shadow-md" 
                type={'file'} name="files" multiple={true}> 
              </input>
            </div>
          </div>
          <div className="w-full justify-center flex flex-col m-auto items-center">
            {images.map((imgFile, i) => 
              <div className="flex justify-center flex-col w-1/3" key={i}>
                <button className="bg-blue-500 text-xl text-white p-1" 
                  onClick={(event) => deleteOldImages(event, imgFile)}>DELETE</button>
                <img alt="img" src={`${API_SERVER_HOST}/api/products/view/s_${imgFile}`}/>
                <input type="hidden" name="uploadFileNames" value={imgFile}/>
              </div>
            )}
          </div>
          <div className="flex justify-end p-2">
            <button type="submit" name='actionType' value='delete' 
              className="rounded p-2 m-2 text-lg w-28 text-white bg-red-500">
                Delete
            </button>
            <button type="submit" name='actionType' value='modify'
              className="inline-block rounded p-2 m-2 text-lg w-28 text-white bg-orange-500">
                Modify
            </button>
            <button type="button" className="rounded p-2 m-2 text-lg w-28 text-white bg-blue-500"
              onClick={() => moveToList()}>
                List
            </button>
          </div>
        </form>
    </div>


  )
};


export default ModifyComponent;