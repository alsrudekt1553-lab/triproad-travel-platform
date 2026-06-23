import { useEffect, useState, type ChangeEvent } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { deleteOne, getOne, putOne } from "../../api/todoApi";
import ResultModal from "../common/resultModal";

const initState: Todo = {
  tno: 0,
  title: '',
  due_date: '',
  complete: false,
  writer: ''
}

function ModifyComponent({tno}: {tno: number}) {

    const [todo, setTodo] = useState<Todo>(initState);
    const [result, setResult] = useState<string | null>(null);  
    const {moveToList,moveToRead} = useCustomMove();

    useEffect(() => {
        // Fetch the todo item to modify
        getOne(tno).then(data => {
            // console.log('ModifyComponent getOne data->', data);
            setTodo(data);
        }).catch(e => {
            console.error(e);
        });
    }, [tno]);

    // Handle changes in the input fields
    // This function updates the state of the todo item
    // when the user types in the input fields
    // 1. (e:ChangeEvent<HTMLInputElement>) - 이 함수는 HTML 입력 요소(input)의 변경 이벤트 매개변수
    // 2. e.target.name - 이벤트가 발생한 입력 요소의 name 속성 값을 가져옴
    // 3. e.target.value - 이벤트가 발생한 입력 요소의 현재 값을 가져옴
    // 4. setTodo - 이전 상태를 유지하면서 새로운 값을 업데이트
    //   4-1. ...prevState: 이전 todo 객체의 모든 속성을 복사
    //   4-2. [name]: value: 변경된 입력 요소의 name 속성에 해당하는 값을 새로운 value로 설정
    // 5. 이 함수는 입력 필드의 값이 변경될 때마다 호출
   const handleChangeTodo = (e:ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('handleChangeTodo name->', name, 'value->', value);
        setTodo((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleChangeTodoComplete = (e:ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value
        todo.complete = (value === 'Y')
        setTodo({...todo})
    }

    const handleClickModify = (): void => {
        // Call API to modify the todo item
        // Assuming there's a function called postModify in todoApi
        console.log('handleClickModify todo->', todo); 
        putOne(todo)
        .then(result => {
            console.log(result);
            setResult(`Todo ${todo.tno} modified successfully`);
         }).catch(e => {
            console.error(e);
        });
    }

    const handleClickDelete = ( ) => {
        deleteOne(tno).then( data => {
        console.log("delete result: " + data)
        setResult('Deleted')
        })
    }
  
    const closeModal = () => {

        if(result ==='Deleted') {
            moveToList()
        }else {
            moveToRead(tno)
        }
        setResult(null)

    }


    return ( 
   <div className = "border-2 border-sky-200 mt-10 m-2 p-4">

        { result && <ResultModal title={'처리결과'} content={result} callbackFn={closeModal} />}
        
        <div className="flex justify-center mt-10">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">TNO</div>
            <div className="w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100">
            {todo.tno}    
            </div> 
            </div>
        </div>


        <div className="flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <div className="w-1/5 p-6 text-right font-bold">WRITER</div>
                <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"
                        name="writer"
                        type={'text'}
                        value={todo.writer}
                        onChange={handleChangeTodo}
                >
                </input>
            </div>
        </div>

        <div className="flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">TITLE</div>
            <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
            name="title"
            type={'text'} 
            value={todo.title}
            onChange={handleChangeTodo}
            >
            </input>
            </div> 
        </div>
        <div className="flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
                <div className="w-1/5 p-6 text-right font-bold">DUEDATE</div>
                <input className="w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md" 
                name="due_date"
                type={'date'} 
                value={todo.due_date || ''}
                onChange={handleChangeTodo}
                >
                </input>
            </div>
        </div>
        <div className="flex justify-center">
            <div className="relative mb-4 flex w-full flex-wrap items-stretch">
            <div className="w-1/5 p-6 text-right font-bold">COMPLETE</div>
            <select
            name="status" 
            className="border-solid border-2 rounded m-1 p-2"
            onChange={handleChangeTodoComplete} 
            value = {todo.complete? 'Y':'N'} >
                <option value='Y'>Completed</option>
                <option value='N'>Not Yet</option>
            </select>
            </div>
        </div>
        
        <div className="flex justify-end p-4">
            <button type="button" 
            className="inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
            onClick={handleClickDelete}
            >
            Delete
            </button>
            <button type="button" 
            className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
            onClick={handleClickModify}
            >
            Modify
            </button> 
        </div>
    </div>





     );
}

export default ModifyComponent;