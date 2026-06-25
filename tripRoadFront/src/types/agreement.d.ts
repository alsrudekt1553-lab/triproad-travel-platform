interface AgreementInfo {
  agreementId: number
  typeCode: 100 | 200 | 300 | 400
  version: string
  title: string
  content: string
  isRequired: 0 | 1
  effectiveFrom: string
}


interface AgreementConsentRequest {
  agreementId: number
}

interface AgreementConsentResponse {
  userAgreementId: number
  bookingId: number
  agreementId: number
  typeCode: 100 | 200 | 300 | 400
  title: string
  version: string
  agreedAt: string
  content: string
  isRequired: 0 | 1
}