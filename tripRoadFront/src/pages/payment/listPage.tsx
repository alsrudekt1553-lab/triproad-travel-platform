import { useSearchParams } from "react-router";
import ListComponent from "../../components/booking/listComponent";

function ListPage() {
    const [queryParams] = useSearchParams();
    const page = queryParams.get("page");
    const size = queryParams.get("size");

    console.log("Payment ListPage page->", page, "size->", size);

    return <ListComponent />;
}

export default ListPage;