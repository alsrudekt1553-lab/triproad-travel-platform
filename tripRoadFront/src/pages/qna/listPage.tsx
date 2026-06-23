import { useSearchParams } from "react-router";
import QnaListComponent from "../../components/qna/QnaListComponent";

function ListPage() {
    const [queryParams] = useSearchParams();

    const page = Number(queryParams.get("page") || "1");
    const size = Number(queryParams.get("size") || "10");
    const mode = queryParams.get("mode") || "all";
    const type = queryParams.get("type") || "";

    return (
        <div className="bg-white rounded-lg p-4 m-2 w-full">
            <QnaListComponent page={page} size={size} mode={mode} type={type} />
        </div>
    );
}

export default ListPage;