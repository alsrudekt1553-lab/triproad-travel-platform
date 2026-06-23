import ListComponent from "../../components/product/listComponent";

function ListPage() {

    return (
        <div className="bg-white rounded-lg p-4 m-2 w-full">
            <div className="text-4xl">상품 목록</div>
            <ListComponent />
        </div>
    );
}

export default ListPage;