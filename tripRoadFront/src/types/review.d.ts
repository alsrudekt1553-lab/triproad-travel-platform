export interface Review {
  reviewId: number;
  userId: number;
  scheduleId: number;
  bookingId: number;
  rating: number;
  content: string;
  reviewStatus: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewAdd {
  scheduleId: number;
  bookingId: number;
  rating: number;
  content: string;
}

export interface ReviewModify {
  reviewId: number;
  scheduleId: number;
  bookingId: number;
  rating: number;
  content: string;
}
export interface ReviewSummary {
  scheduleId: number;
  avgRating: number;
  reviewCount: number;
}