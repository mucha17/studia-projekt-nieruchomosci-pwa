export type InvestmentStatus = 'nowa' | 'w-budowie' | 'gotowa' | 'w-sprzedazy'

export interface Investment {
  id: string
  name: string
  cityName: string
  regionName: string
  category: string
  areaRange: string
  imageUrl: string
  status: InvestmentStatus
}
