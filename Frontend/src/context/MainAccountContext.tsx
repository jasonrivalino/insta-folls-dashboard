import { createContext } from "react"

export type MainAccount = {
  id: number
  username: string
}

type MainAccountContextType = {
  account: MainAccount | null
  setAccount: (data: MainAccount) => void
  refreshAccount: () => Promise<void>
}

export const MainAccountContext =
  createContext<MainAccountContextType | null>(null)