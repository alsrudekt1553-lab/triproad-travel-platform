import { useEffect, useState } from "react"

interface Props {
  bookings: Admin01Booking[]
}

const PAGE_SIZE = 10

function AdminBookingListComponent({ bookings }: Props) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE))
  const startIndex = (page - 1) * PAGE_SIZE
  const pageBookings = bookings.slice(startIndex, startIndex + PAGE_SIZE)

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  if (bookings.length === 0) {
    return (
      <div className="border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 shadow-sm">
        예약 내역이 없습니다.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-center text-sm">
        <thead className="bg-sky-50 text-neutral-700">
          <tr>
            <th className="border-b border-neutral-200 p-3">예약번호</th>
            <th className="border-b border-neutral-200 p-3">회원명</th>
            <th className="border-b border-neutral-200 p-3">상품명</th>
            <th className="border-b border-neutral-200 p-3">예약일</th>
            <th className="border-b border-neutral-200 p-3">상태</th>
          </tr>
        </thead>
        <tbody>
          {pageBookings.map((booking) => (
            <tr
              key={booking.bookingId}
              className="transition hover:bg-sky-50/60"
            >
              <td className="border-b border-neutral-100 p-3">{booking.bookingId}</td>
              <td className="border-b border-neutral-100 p-3 font-semibold text-neutral-800">{booking.userName}</td>
              <td className="border-b border-neutral-100 p-3">{booking.productName}</td>
              <td className="border-b border-neutral-100 p-3">{booking.bookingDate?.substring(0, 10)}</td>
              <td className="border-b border-neutral-100 p-3">
                <span className="inline-flex border border-neutral-300 bg-neutral-50 px-2 py-1 text-xs font-semibold text-neutral-700">
                  {booking.statusName}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-neutral-200 p-3 text-sm">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="border border-neutral-300 px-3 py-1 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNo) => (
            <button
              key={pageNo}
              type="button"
              onClick={() => setPage(pageNo)}
              className={`border px-3 py-1 ${
                page === pageNo
                  ? "border-sky-700 bg-sky-700 text-white"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {pageNo}
            </button>
          ))}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            className="border border-neutral-300 px-3 py-1 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminBookingListComponent