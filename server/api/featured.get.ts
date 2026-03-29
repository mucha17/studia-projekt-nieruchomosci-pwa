import { listings } from '../data/listings'

export default defineEventHandler(() => listings.slice(0, 6))
