import LoginComponent from "../../components/user01/loginComponent";


function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md py-8">
      <div className="border border-neutral-200 bg-white px-6 py-8 shadow-sm sm:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-neutral-900">로그인</h1>
          <p className="mt-2 text-sm text-neutral-500">
            TripRoad에서 새로운 여행을 시작하세요.
          </p>
        </div>

        <LoginComponent />
      </div>
    </section>
  )
}

export default LoginPage;