import ListComponent from "../../components/product/listComponent";

function ListPage() {

    return (
    <div className="w-full">
        <section className="border-b border-sky-200 bg-sky-100 px-6 py-7">
        <h1 className="text-2xl font-extrabold text-sky-900">
            여행 패키지
        </h1>

        <p className="mt-2 text-sm text-neutral-600">
            지역과 테마에 맞는 여행을 찾아보세요.
        </p>
        </section>

        <div className="py-7">
        <ListComponent />
        </div>
    </div>
    )
}

export default ListPage;