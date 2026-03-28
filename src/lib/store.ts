import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Merchant {
  id: string
  phone: string
  name: string | null
  store_slug: string | null
}

interface MerchantStore {
  merchant: Merchant | null
  setMerchant: (merchant: Merchant | null) => void
  clearMerchant: () => void
  isLoading: boolean
  setLoading: (isLoading: boolean) => void
}

export const useStore = create<MerchantStore>()(
  persist(
    (set) => ({
      merchant: null,
      setMerchant: (merchant) => set({ merchant }),
      clearMerchant: () => set({ merchant: null }),
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'gully-store',
    }
  )
)
