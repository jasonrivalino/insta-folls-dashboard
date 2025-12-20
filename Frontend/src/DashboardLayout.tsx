import { Outlet } from 'react-router-dom'
import Sidebar from './components/sidebar'

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-linear-to-br from-blue-100 via-blue-200 to-blue-400">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6 bg-linear-to-br from-blue-100 via-blue-200 to-blue-200">
        <Outlet />
      </main>
    </div>
  )
}