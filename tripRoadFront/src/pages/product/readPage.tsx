import { Navigate, useParams } from "react-router";
import ReadComponent from "../../components/product/readComponent";

function ReadPage() {

    const { productId } = useParams();
    console.log("ReadPage productId:", productId);

    if (!productId) return <Navigate to="/product/list" />;

    return (
        <div className="bg-white w-full">
            <ReadComponent productId={Number(productId)} />
        </div>
    );
}

export default ReadPage;
