import FindLoginIdComponent from "../../components/user01/findLoginIdComponent";

function FindLoginIdPage() {
	return (
		<section className="mx-auto w-full max-w-md py-8">
			<div className="border border-neutral-200 bg-white px-6 py-8 shadow-sm sm:px-8">
				<div className="text-center">
					<h1 className="text-2xl font-extrabold text-neutral-900">
						아이디 찾기
					</h1>
					<p className="mt-2 text-sm text-neutral-500">
						가입할 때 입력한 이름과 이메일을 확인합니다.
					</p>
				</div>

				<FindLoginIdComponent />
			</div>
		</section>
	)
}

export default FindLoginIdPage;
