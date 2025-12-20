export default function InstagramUserList() {
  const thClass = "px-4 py-1 text-center border-b border-gray-300 text-sm";

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold">Instagram Users Data</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className={thClass}>No.</th>
              <th className={thClass}>PK Insta</th>
              <th className={thClass}>Pic</th>
              <th className={thClass}>Username</th>
              <th className={thClass}>Fullname</th>
              <th className={thClass}>Private</th>
              <th className={thClass}>Followers</th>
              <th className={thClass}>Following</th>
              <th className={thClass}>Posts</th>
              <th className={thClass}>Biography</th>
              <th className={thClass}>Mutual</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}