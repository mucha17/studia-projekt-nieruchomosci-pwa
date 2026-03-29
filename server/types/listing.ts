export type PropertyType = 'mieszkanie' | 'pokoj' | 'dom' | 'dzialka' | 'lokal' | 'budynek'
export type TransactionType = 'sprzedaz' | 'wynajem'

export interface PropertyListing {
  id: string
  title: string
  price: number
  area: number
  pricePerM2: number
  city: string
  district?: string
  rooms?: number
  type: PropertyType
  transactionType: TransactionType
  imageUrl: string
  agencyName: string
  agencyLogoUrl?: string
}
