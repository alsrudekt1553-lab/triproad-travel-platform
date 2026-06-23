import AddProductComponent from "../../components/admin01/addProductComponent"


function AddPage() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-neutral-900">
          패키지 상품 등록
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          여행 패키지의 기본 정보와 대표 이미지를 등록합니다.
        </p>
      </div>

      <AddProductComponent />
    </section>
  )
}

export default AddPage