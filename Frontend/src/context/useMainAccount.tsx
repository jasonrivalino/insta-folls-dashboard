import { useContext } from "react"
import { MainAccountContext } from "./MainAccountContext"

// Custom hook to access the main account context
export const useMainAccount = () => {
  const ctx = useContext(MainAccountContext)
  if (!ctx) {
    throw new Error("useMainAccount must be used inside MainAccountProvider")
  }
  return ctx
}