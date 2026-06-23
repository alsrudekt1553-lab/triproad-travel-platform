import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { useNavigate, useParams } from "react-router"
import {
  getAdminScheduleList,
  postModifySchedule
} from "../../api/admin01Api"

function ModifyScheduleComponent() {
  const { productId, scheduleId } = useParams()
  const navigate = useNavigate()

  const [schedule, setSchedule] =
    useState<Admin01Schedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (
        !productId ||
        !scheduleId ||
        Number.isNaN(Number(productId)) ||
        Number.isNaN(Number(scheduleId)) ||
        Number(productId) <= 0 ||
        Number(scheduleId) <= 0
    ) {
        setError("일정 정보가 올바르지 않습니다.")
        setLoading(false)
        return
    }

    getAdminScheduleList(Number(productId))
      .then((data) => {
        const selected = data.find(
          (item) =>
            item.scheduleId === Number(scheduleId)
        )

    if (!selected) {
    setError("존재하지 않는 일정입니다.")
    return
    }

    if (selected.productId !== Number(productId)) {
    setError("해당 상품에 속하지 않는 일정입니다.")
    return
    }

    setSchedule(selected)
      })
      .catch(() => {
        setError("일정 정보를 불러오지 못했습니다.")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [productId, scheduleId])

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!productId || !schedule) {
      return
    }

    const formData = new FormData(e.currentTarget)

    const title =
      formData.get("title")?.toString().trim() ?? ""
    const content =
      formData.get("content")?.toString().trim() ?? ""
    const startDate =
      formData.get("startDate")?.toString() ?? ""
    const endDate =
      formData.get("endDate")?.toString() ?? ""
    const maxHeadcount =
      Number(formData.get("maxHeadcount"))

    if (!title) {
      alert("일정 제목을 입력해주세요.")
      return
    }

    if (!content) {
      alert("일정 설명을 입력해주세요.")
      return
    }

    if (!startDate || !endDate) {
      alert("시작일과 종료일을 입력해주세요.")
      return
    }

    if (endDate < startDate) {
      alert("종료일은 시작일보다 빠를 수 없습니다.")
      return
    }

    if (
      Number.isNaN(maxHeadcount) ||
      maxHeadcount < 1 ||
      maxHeadcount > 999
    ) {
      alert("최대 인원은 1명 이상 999명 이하로 입력해주세요.")
      return
    }

    try {
      setSubmitting(true)

      await postModifySchedule(formData)

      alert("일정 정보가 수정되었습니다.")
      navigate(`/admin01/product/${productId}`)
    } catch {
      alert("일정 수정 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-sm text-neutral-500">
        일정 정보를 불러오는 중입니다.
      </div>
    )
  }

  if (error || !schedule) {
    return (
      <div>
        <div className="border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
          {error || "일정 정보가 없습니다."}
        </div>

        {productId && (
          <button
            type="button"
            onClick={() =>
              navigate(`/admin01/product/${productId}`)
            }
            className="mt-4 rounded-md border border-neutral-300 px-4 py-2 text-sm font-bold text-neutral-600"
          >
            상품 상세로
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-extrabold text-neutral-900">
          일정 정보 수정
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          등록된 여행 일정의 내용을 수정합니다.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <input
          name="scheduleId"
          type="hidden"
          value={schedule.scheduleId}
        />

        <input
          name="productId"
          type="hidden"
          value={schedule.productId}
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="scheduleTitle"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              일정 제목
            </label>

            <input
              id="scheduleTitle"
              name="title"
              defaultValue={schedule.title}
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="scheduleContent"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              일정 설명
            </label>

            <textarea
              id="scheduleContent"
              name="content"
              rows={6}
              defaultValue={schedule.content}
              required
              className="w-full resize-y rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              시작일
            </label>

            <input
              id="startDate"
              name="startDate"
              type="date"
              defaultValue={schedule.startDate.slice(0, 10)}
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              종료일
            </label>

            <input
              id="endDate"
              name="endDate"
              type="date"
              defaultValue={schedule.endDate.slice(0, 10)}
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="maxHeadcount"
              className="mb-2 block text-sm font-bold text-neutral-700"
            >
              최대 인원
            </label>

            <input
              id="maxHeadcount"
              name="maxHeadcount"
              type="number"
              min="1"
              max="999"
              defaultValue={schedule.maxHeadcount}
              required
              className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="mt-2 flex gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() =>
                navigate(`/admin01/product/${productId}`)
              }
              className="w-1/3 rounded-md border border-neutral-300 bg-white px-4 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-50"
            >
              취소
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-2/3 rounded-md bg-sky-700 px-4 py-3 text-sm font-bold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
            >
              {submitting ? "수정 중..." : "일정 정보 수정"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ModifyScheduleComponent