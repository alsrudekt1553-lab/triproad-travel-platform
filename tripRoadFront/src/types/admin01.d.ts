interface Admin01Booking {
  bookingId: number
  userName: string
  productName: string
  bookingDate: string
  statusName: string
  status: number
}

interface Admin01ProductAddResult {
  result: number
  error?: string
}

interface Admin01ScheduleAddResult {
  result: number
  error?: string
}

interface Admin01Product {
  productId: number
  regionId: number
  themeCode: number
  productName: string
  description: string
  price: number
  imageName?: string
}

interface Admin01Region {
  bcode: number
  mcode: number
  codeContents: string
}

interface Admin01Theme {
  themeCode: number
  themeName: string
}

interface Admin01Schedule {
  scheduleId: number
  productId: number
  title: string
  content: string
  startDate: string
  endDate: string
  maxHeadcount: number
  status: number
}

interface Admin01ModifyResult {
  result: number
  error?: string
}