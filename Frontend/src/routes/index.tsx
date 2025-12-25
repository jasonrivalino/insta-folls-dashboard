import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../DashboardLayout'
import MainDashboard from '../pages/dataVisualization/mainDashboard'
import InstagramUserList from '../pages/dataVisualization/instagramUserList'
import RelationalList from '../pages/settings/relationalList'
import ChangeInstaInfo from '../pages/settings/changeInstaInfo'
import ProfileEdit from '../pages/settings/profileEdit'
import NotFoundPage from '../pages/handling/404NotFound'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        {/* Data Visualization Routes */}
        <Route path="/" element={<MainDashboard />} />
        <Route path="/instagram-users-list" element={<InstagramUserList />} />

        {/* Settings Routes */}
        <Route path="/settings/change-insta-info" element={<ChangeInstaInfo />} />
        <Route path="/settings/relational-list" element={<RelationalList />} />
        <Route path="/settings/profile-edit" element={<ProfileEdit />} />
      </Route>

      {/* 404 Not Found Handler */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}