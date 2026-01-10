import type { RelationalDetail } from "../../../models/table.models";

type Props = {
  relationalList: RelationalDetail[]
  onSelect: (relational: RelationalDetail | null) => void
  index: number
}

export default function MultipleBarDropdown({
  relationalList,
  onSelect,
  index
}: Props) {
  return (
    <select
      className="px-3 py-1.5 w-full shadow-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onChange={e => {
        if (!e.target.value) {
          onSelect(null)
          return
        }

        const selected = relationalList.find(
          r => r.id === Number(e.target.value)
        )
        if (selected) onSelect(selected)
      }}
    >
      <option value="">Relational Option {index + 1}</option>

      {relationalList.map(rel => (
        <option key={rel.id} value={rel.id}>
          {rel.relational}
        </option>
      ))}
    </select>
  )
}