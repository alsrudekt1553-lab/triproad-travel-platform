import { useEffect, useState } from "react";
import useCustomMove from "../../hooks/useCustomMove";
import { getOne } from "../../api/todoApi";


function ReadComponent({tno}: {tno: number}) {

    const {moveToList, moveToModify} = useCustomMove();
    const [todo, setTodo] = useState<Todo|undefined>();

    useEffect(() => {
        console.log("ReadComponent useEffect tno:", tno);
        getOne(tno).then (data=>{
                console.log('ReadComponent getOne data->',data);
                setTodo(data);
        })        
    }, [tno]);


    return (
        <>
        {todo &&
        <div className = "border-2 border-sky-200 mt-10 m-2 p-4 text-2xl">   
            {makeDiv('Tno', todo.tno)}
            {makeDiv('Writer', todo.writer)}
            {makeDiv('Title', todo.title)}
            {makeDiv('Complete', todo.complete ? 'Completed' : 'Not Yet')} 
            <div className="flex justify-end p-4">

                <button type="button" 
                className="rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"
                onClick={() => moveToList() }
                >
                    List
                </button>

                <button type="button" 
                className="rounded p-4 m-2 text-xl w-32 text-white bg-red-500"
                onClick={() => moveToModify(tno)} 
                > 
                    수정/삭제 
                </button> 
                
            </div>
        </div>
        }
        </>


    );
}

function makeDiv(label: string, value: string | number | boolean) {
    return (
    <div className="flex justify-center">
        <div className="relative mb-4 flex w-full flex-wrap items-stretch">
        <div className="w-1/5 p-6 text-right font-bold">{label}</div>
        <div className="w-4/5 p-6 rounded-r border border-solid shadow-md">
            {value} 
        </div>
        </div>
    </div> 
    );
}


export default ReadComponent;