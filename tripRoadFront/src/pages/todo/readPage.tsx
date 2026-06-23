import { useParams } from "react-router";
import ReadComponent from "../../components/todo/readComponent";



function ReadPage() {

    const {tno} = useParams(); // URL에서 tno 파라미터를 추출
    console.log("ReadPage tno:", tno); // tno 값이 제대로 추출되었는지 확인

    return (
        <div className="bg-white w-full">
            <div className="text-4xl">Todo Read Page  {tno}</div>
            <ReadComponent tno={Number(tno)}/>
        </div>
    );
}

export default ReadPage;