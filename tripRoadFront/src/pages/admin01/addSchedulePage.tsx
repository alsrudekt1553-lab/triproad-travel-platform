import AddScheduleComponent from "../../components/admin01/addScheduleComponent"

function AddSchedulePage() {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-neutral-900">
          패키지 일정 등록
        </h2>
      </div>

      <AddScheduleComponent />
    </section>
  )
}

export default AddSchedulePage