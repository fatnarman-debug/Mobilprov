import type { ReactNode } from 'react'
import { paymentMetadata } from './metadata'

export const metadata = paymentMetadata

export default function PaymentLayout({ children }: { children: ReactNode }) {
  return children
}
