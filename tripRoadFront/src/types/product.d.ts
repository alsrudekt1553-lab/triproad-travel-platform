// 상품 목록 조회 시 응답 타입
interface ProductListDto {
	productId: number
	productName: string
	price: number
	themeName: string | null
	regionId: number | null
	regionName: string | null
	imageName: string | null
	averageRating: number | null
}

// 상품 상세 조회 시 응답 타입
interface ProductDetailDto {
  productId: number
  productName: string
  description: string
  price: number
  themeName: string | null
  regionId: number | null
  regionName: string | null
  regDate: string
  imageNames: string[]
  schedules: Schedule[]
}

// 일정 정보
interface Schedule {
  scheduleId: number
  title: string
  content: string
  status: number
  startDate: string
  endDate: string
  maxHeadcount: number | null
}

// 테마 정보
interface Theme {
  themeCode: number
  themeName: string
}

// 후기 정보
interface ProductReviewDto {
  reviewId: number
  userId: number
  bookingId: number
  productId: number
  rating: number
  content: string
  reviewImage: string | null
  createdAt: string
  updatedAt: string
  reviewStatus: number
}

// API 페이징 요청
interface PageParam {
  page: number
  size: number
}
