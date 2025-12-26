import { useEffect, useState } from "react"
import { useMainAccount } from "../../context/useMainAccount"
import { getPersonalProfileData } from "../../services/settings/profileEdit.services"
import { ArrowUpDown } from "lucide-react";
import { FiUsers, FiUserPlus, FiGrid, FiLock, FiUnlock } from "react-icons/fi"
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import type { InstaRelationalData } from "../../models/table.models"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProfileEdit() {
  const { account } = useMainAccount()
  const [profile, setProfile] = useState<InstaRelationalData | null>(null)
  const [loading, setLoading] = useState(true)

  // Change Main Instagram Settings Modal State
  const [openChangeMain, setOpenChangeMain] = useState(false)
  const [selectedMain, setSelectedMain] = useState<number | null>(null)
  const isChanged = selectedMain !== account?.id

  useEffect(() => {
    if (!account?.id) return
    setSelectedMain(account.id)

    const loadProfile = async () => {
      try {
        const result = await getPersonalProfileData(account.id)
        setProfile(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [account?.id])

  if (loading) return <p className="text-gray-600">Loading profile...</p>
  if (!profile) return <p className="text-red-500">Profile not found</p>

  const { instagram_detail } = profile

  return (
    <div className="flex flex-col gap-5">
      {/* PAGE HEADER */}
      <div className="flex flex-row mx-auto justify-between w-full items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-gray-800">Settings - Main Instagram Profile Center</h1>
          <p className="text-sm text-gray-800">View and Manage your main Instagram Profile Information</p>
        </div>
      </div>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 space-y-4 h-[81.5vh] max-h-[81.5vh] overflow-y-auto">
        <div className="flex flex-col bg-gray-100 p-3 rounded-xl shadow-sm border border-gray-200 gap-3">
            <div className="flex justify-between items-start">
                <div className="flex flex-col items-start">
                    <h4 className="text-sm text-gray-500">User PK: #{instagram_detail.pk_def_insta}</h4>
                    <h2 className="text-2xl font-bold text-gray-900">@{instagram_detail.username}</h2>
                    <p className="text-gray-500 font-semibold">{instagram_detail.fullname}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold rounded-lg bg-white px-2 py-1 border border-gray-300">
                    {instagram_detail.is_private ? (
                    <>
                        <FiLock className="text-red-500" />
                        Private Account
                    </>
                    ) : (
                    <>
                        <FiUnlock className="text-green-600" />
                        Public Account
                    </>
                    )}
                </div>
            </div>
            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm w-full">
                <p className="text-gray-700 whitespace-pre-line text-sm">
                    {instagram_detail.biography || "-"}
                </p>
            </div>
        </div>

        {/* STATS */}
        <div className="flex flex-row justify-between gap-4">
            <div className="w-1/4">
                <StatCard label="Posts" value={instagram_detail.media_post_total} icon={<FiGrid />} />
            </div>
            <div className="flex justify-center">
                <div className="h-full w-px bg-gray-300" />
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1">
                <StatCard label="Followers" value={instagram_detail.followers} icon={<FiUsers />} />
                <StatCard label="Following" value={instagram_detail.following} icon={<FiUserPlus />} />
                <StatCard label="Gap" value={instagram_detail.gap} icon={<ArrowUpDown />} />
            </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-2">Account Settings</h2>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                {/* CHANGE MAIN ACCOUNT CENTER */}
                <button
                    onClick={() => setOpenChangeMain(!openChangeMain)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
                >
                    <h3 className="text-base font-semibold text-gray-800">Change Main Account Center</h3>
                    <FontAwesomeIcon icon={openChangeMain ? faCaretUp : faCaretDown} className="text-gray-600"/>
                </button>

                {/* CONTENT */}
                {openChangeMain && (
                    <div className="px-4 py-3 border-t border-gray-200 flex flex-row gap-4 items-center justify-between">
                        <div className="flex flex-row gap-4 items-center">
                            <span className="text-sm text-gray-600 font-medium">
                                Select Main Account Center:
                            </span>

                            <select
                                value={selectedMain ?? ""}
                                onChange={(e) => setSelectedMain(Number(e.target.value))}
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                <option value={account?.id}>
                                    @{instagram_detail.username} (Current)
                                </option>

                                {/* Example additional options */}
                                <option value={2}>@another_account</option>
                                <option value={3}>@brand_account</option>
                            </select>
                        </div>

                        {/* CONFIRM BUTTON */}
                        <button
                            disabled={!isChanged}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold transition
                            ${
                                isChanged
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }
                            `}
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  )
}


function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon?: React.ReactNode
}) {
  const isGap = label === "Gap"

  const containerClass = `
    rounded-xl p-4 flex items-center gap-4
    border shadow-sm transition
    ${
      isGap && value > 0
        ? "bg-green-50 border-green-400 shadow-green-200"
        : isGap && value < 0
        ? "bg-red-50 border-red-400 shadow-red-200"
        : "bg-white border-blue-400 shadow-blue-200"
    }
  `

  const iconClass = `
    text-xl
    ${
      isGap && value > 0
        ? "text-green-600"
        : isGap && value < 0
        ? "text-red-600"
        : "text-blue-600"
    }
  `

  const valueClass = `
    text-xl font-bold
    ${
      isGap && value > 0
        ? "text-green-700"
        : isGap && value < 0
        ? "text-red-700"
        : "text-gray-900"
    }
  `

  return (
    <div className={containerClass}>
      {icon && <div className={iconClass}>{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={valueClass}>{value}</p>
      </div>
    </div>
  )
}