import ResetPasswordComponent from "../../components/user01/resetPasswordComponent";

function ResetPasswordPage() {
	return (
		<section className="mx-auto w-full max-w-md py-8">
			<div className="border border-neutral-200 bg-white px-6 py-8 shadow-sm sm:px-8">
				<div className="text-center">
					<h1 className="text-2xl font-extrabold text-neutral-900">
						비밀번호 재설정
					</h1>
					<p className="mt-2 text-sm text-neutral-500">
						이메일 인증 후 새로운 비밀번호를 설정합니다.
					</p>
				</div>

				<ResetPasswordComponent />
			</div>
		</section>
	)
}

export default ResetPasswordPage;
