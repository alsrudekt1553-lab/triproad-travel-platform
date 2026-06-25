import { useEffect, useState } from "react"
import { getBookingList } from "../../api/admin01Api"
import AdminBookingListComponent from "../../components/admin01/adminBookingListComponent"

function ListPage() {
  const [bookings, setBookings] = useState<Admin01Booking[]>([])
  const [loading, setLoading] = useState(true)

  const [error, setError] = useState("")

  useEffect(() => {
    getBookingList()
      .then(setBookings)
      .catch(() => setError("예약 목록을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-4 w-full">예약 목록 불러오는 중...</div>
  }
  if (error) {
    return <div className="p-4 w-full text-red-500">{error}</div>
  }
  return (
    <section className="w-full">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-neutral-900">
            예약 목록
          </h2>
        </div>

        <div className="text-sm font-semibold text-neutral-500">
          총 {bookings.length}건
        </div>
      </div>

      <AdminBookingListComponent bookings={bookings} />
    </section>
  )
}

export default ListPage