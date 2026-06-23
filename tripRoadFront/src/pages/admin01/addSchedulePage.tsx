import AddScheduleComponent from "../../components/admin01/addScheduleComponent"

function AddSchedulePage() {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-neutral-900">
          패키지 일정 등록
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          등록된 상품에 예약 가능한 여행 일정을 추가합니다.
        </p>
      </div>

      <AddScheduleComponent />
    </section>
  )
}

export default AddSchedulePage