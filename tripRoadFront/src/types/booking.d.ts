interface BookingHoldRequest {
  userId: number
  scheduleId: number
  headcount: number
  reserverName: string
  reserverPhone: string
  reserverEmail: string
  pointUsed: number
  agreementIds: number[]
}

interface BookingHoldResponse {
  bookingId: number
  userId: number
  scheduleId: number
  headcount: number
  totalPrice: number
  discountAmount: number
  finalPrice: number
  status: number
  holdAt: string
  createdAt: string
  reserverName: string
  reserverPhone: string
  reserverEmail: string
  pointUsed: number
}

interface BookingConfirmResponse {
  bookingId: number
  status: number      
  updatedAt: string
}

interface BookingInfo {
  bookingId: number
  userId: number
  scheduleId: number
  headcount: number
  totalPrice: number
  discountAmount: number
  finalPrice: number
  status: number
  holdAt: string
  createdAt: string
  updatedAt: string
  reserverName: string
  reserverPhone: string
  reserverEmail: string
  pointUsed: number
  productName: string
  startDate: string | null
  endDate: string | null
  payStatus: number
  approvedAt: string | null
  paymentMethod: number
}

interface BookingScheduleView {
  scheduleId: number
  productId: number       
  productName: string
  unitPrice: number
  startDate: string     
  endDate: string
  maxHeadcount: number
  remainingCount: number
}