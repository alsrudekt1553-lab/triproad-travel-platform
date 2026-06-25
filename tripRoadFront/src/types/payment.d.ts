interface PaymentReadyRequest {
  bookingId: number
  userId: number
  scheduleId: number
  itemName: string          
  amount: number           
  approvalUrl: string       
  cancelUrl: string         
  failUrl: string           
}

interface PaymentApproveRequest {
  tid: string               
  pgToken: string           
  partnerOrderId: number    
  userId: number            
}

interface PaymentReadyResponse {
  tid: string                     
  nextRedirectPcUrl: string      
  nextRedirectMobileUrl: string   
  partnerOrderId: number         
}

interface PaymentApproveResponse {
  paymentId: number
  bookingId: number
  tid: string
  amount: number
  payStatus: number              
  approvedAt: string              
}

interface PaymentInfo {
  paymentId: number
  bookingId: number
  tid: string
  amount: number
  payStatus: number         
  approvedAt: string       
}