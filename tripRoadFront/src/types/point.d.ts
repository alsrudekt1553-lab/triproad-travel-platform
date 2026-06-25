interface UserPointBalance {
  userId: number
  pointBalance: number
  updatedAt: string | null
}

interface UserPointHistory {
  historyId: number
  userId: number
  bookingId: number | null
  ledgerId: number | null
  pointAmount: number
  pointBalanceAfter: number
  historyType: number
  relatedType: string | null
  relatedId: number | null
  scheduleId: number | null
  createdAt: string
}

interface UserPointUseRequest {
  userId: number
  amount: number
  bookingId: number
}

interface UserPointRefundRequest {
  userId: number
  amount: number
  bookingId: number
}

interface UserPointLedgerDetail {
  ledgerId: number
  userId: number
  pointAmount: number      
  remainingAmount: number   
  sourceType: number
  sourceId: number | null
  earnedAt: string
  expiresAt: string
  status: number
}

interface UserPointSourceSummary {
  sourceType: number
  totalRemaining: number
  ledgerCount: number
}

interface UserPointExpiringSoon {
  ledgerId: number
  userId: number
  remainingAmount: number
  expiresAt: string
  daysUntilExpire: number
}