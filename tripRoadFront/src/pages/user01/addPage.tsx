import AddComponent from "../../components/user01/addComponent";

function AddPage() {
    return ( 
        <section className="mx-auto w-full max-w-2xl py-8">
            <div className="border border-neutral-200 bg-white px-6 py-8 shadow-sm sm:px-10">
                <div className="text-center">
                    <h1 className="text-2xl font-extrabold text-neutral-900">회원가입</h1>
                    <p className="mt-2 text-sm text-neutral-500">
                        여행 예약에 필요한 정보를 입력해주세요.
                    </p>
                </div>

                <AddComponent />
            </div>
        </section>
    );
}

export default AddPage;