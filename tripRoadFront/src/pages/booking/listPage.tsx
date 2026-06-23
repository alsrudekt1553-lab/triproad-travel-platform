import { useSearchParams } from "react-router";
import ListComponent from "../../components/booking/listComponent";

function ListPage() {
  const [queryParams] = useSearchParams();
  const page = queryParams.get('page');
  const size = queryParams.get('size');

  console.log('Booking ListPage page->', page, 'size->', size);

  return (
    <div className="bg-white p-4 m-2 w-full">
      <div className="text-2xl font-semibold text-black mb-4 font-sans tracking-tight-kr">
        예약 내역
      </div>
      <ListComponent />
    </div>
  );
}

export default ListPage;