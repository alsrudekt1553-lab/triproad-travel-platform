import { useParams, useLocation } from "react-router";
import HoldComponent from "../../components/booking/holdComponent";

function HoldPage() {
  const { scheduleId } = useParams();
  const location = useLocation();

  console.log('Booking HoldPage scheduleId->', scheduleId, 'state->', location.state);

  return (
    <div className="bg-white rounded-lg p-4 m-2 w-full">
      <HoldComponent />
    </div>
  );
}

export default HoldPage;