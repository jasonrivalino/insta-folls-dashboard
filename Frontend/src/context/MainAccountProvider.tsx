import { useEffect, useState } from "react"
import axios from "axios"
import { type MainAccount, MainAccountContext } from "./MainAccountContext"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Provider component that wraps the app and makes the main account object available to any child component that calls the useMainAccount hook.
export function MainAccountProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<MainAccount | null>(null)

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(`${BACKEND_URL}/api/main-account-center`)
      setAccount(res.data.data)
    })()
  }, [])

  const refreshAccount = async () => {
    const res = await axios.get(`${BACKEND_URL}/api/main-account-center`)
    setAccount(res.data.data)
  }

  return (
    <MainAccountContext.Provider
      value={{ account, setAccount, refreshAccount }}
    >
      {children}
    </MainAccountContext.Provider>
  )
}