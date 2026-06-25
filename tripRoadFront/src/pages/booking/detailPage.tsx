import { useParams } from "react-router";
import DetailComponent from "../../components/booking/detailComponent";

function DetailPage() {
  const { bookingId } = useParams();

  console.log('Booking DetailPage bookingId->', bookingId);

  if (!bookingId) {
    return (
      <div className="max-w-[520px] mx-auto px-6 py-8 text-[14px] text-grey-5 font-sans tracking-tight-kr">
        예약 정보를 찾을 수 없습니다.
      </div>
    );
  }

  return <DetailComponent bookingId={parseInt(bookingId)} />;
}

export default DetailPage;