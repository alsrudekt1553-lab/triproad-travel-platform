import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8587";
const prefix = `${API_SERVER_HOST}/api/todo`;

export const getList = async(pageParam: PageParam) =>{

    console.log("todo getList called with pageParam:", pageParam);
    const {page, size} = pageParam;
    console.log("todo getList prefix:", prefix);
    const response = await axios(`${prefix}/list`, {params: {page:page, size:size}});
    console.log("todo getList response:", response);

    return response.data
}

export const postAdd = async (todoObj:TodoAdd) => {
    console.log('postAdd todoObj->',todoObj)

    const res = await axios.post(`${prefix}/register` , todoObj)
    //  {  "TNO": 41 }
    console.log('postAdd res->',res)
    return res.data
}


export const getOne = async (tno: number | string ) => {
    console.log('getOne tno->',tno)
    const res = await axios.get(`${prefix}/${tno}` )
    return res.data
}

export const putOne = async (todo: TodoModify) => {
    console.log('putOne todo->',todo)
    const res = await axios.put(`${prefix}/modify/${todo.tno}`, todo)
    return res.data
}
  
export const deleteOne = async (tno: number) => {
    console.log('deleteOne tno->',tno)
    const res = await axios.delete(`${prefix}/remove/${tno}` )
    return res.data
}

