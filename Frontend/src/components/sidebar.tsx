import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

export default function Sidebar() {
  const [isDataMenuOpen, setDataMenuOpen] = useState(true)
  const [isSettingsMenuOpen, setSettingsMenuOpen] = useState(false)

  const menuItemClass = ({ isActive }: { isActive: boolean }) =>
    `block px-2 py-1.5 rounded hover:bg-blue-100 transition ${
      isActive ? 'bg-blue-100 font-bold text-[#23476A]' : 'text-white hover:text-blue-600'
    }`

  return (
    <aside className="w-1/6 bg-[#23476A] shadow-md shadow-[#23476A] h-screen flex flex-col rounded-r-2xl gap-4 z-30 hover:shadow-lg transition-shadow hover:z-40">
      <div className="flex flex-col items-center gap-2.5 border-b-2 border-white p-4">
        <h1 className="font-bold text-2xl text-white text-center">Instagram Dashboard Analytics</h1>
        <h3 className="text-base text-gray-900 px-2 py-0.5 bg-white rounded font-medium">Main Acc: @your_insta</h3> 
      </div>
      
      <nav className="flex-1 space-y-1.5 pl-2.5 pr-3">
        {/* Data Visualization Menu */}
        <div>
          <button
            className="flex items-center justify-between w-full px-2 py-1.5 text-white font-semibold hover:text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => setDataMenuOpen(!isDataMenuOpen)}
          >
            <span>Data Visualization</span>
            {isDataMenuOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
          {isDataMenuOpen && (
            <div className="ml-3.5 mt-0.5 space-y-0.5">
              <NavLink to="/" className={menuItemClass}>
                Main Dashboard
              </NavLink>
              <NavLink to="/instagram-users-list" className={menuItemClass}>
                Instagram User List
              </NavLink>
            </div>
          )}
        </div>

        {/* Settings Menu */}
        <div>
          <button
            className="flex items-center justify-between w-full px-2 py-1.5 text-white font-semibold hover:text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => setSettingsMenuOpen(!isSettingsMenuOpen)}
          >
            <span>Settings</span>
            {isSettingsMenuOpen ? <FiChevronDown /> : <FiChevronRight />}
          </button>
          {isSettingsMenuOpen && (
            <div className="ml-3.5 mt-0.5 space-y-0.5">
              <NavLink to="/settings/change-insta-info" className={menuItemClass}>
                Change Insta Info
              </NavLink>
              <NavLink to="/settings/relational-list" className={menuItemClass}>
                Relational List
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <div className="mt-auto text-white text-sm px-2 text-center font-semibold pb-4">
        © 2025 J.R
      </div>
    </aside>
  )
}