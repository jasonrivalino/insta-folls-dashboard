type BaseItem = {
  id: number
}

type Props<T extends BaseItem> = {
  items: T[]
  placeholder: string
  noText: string
  getLabel: (item: T) => string
  onSelect: (id: number | null) => void
  disabled?: boolean
}

export default function MultipleGraphDropdown<T extends BaseItem>({items, placeholder, noText, getLabel, onSelect, disabled = false}: Props<T>) {
  return (
    <select
      disabled={disabled}
      className={`px-3 py-1.5 w-full shadow-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500
        ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white border-gray-300"
        }
      `}
      onChange={(e) => {
        if (e.target.value === "all") {
          onSelect(null)
          return
        }
        onSelect(Number(e.target.value))
      }}
    >
      <option value="all">{placeholder}</option>
      <option value={0}>{noText}</option>

      {items.map((item) => (
        <option key={item.id} value={item.id}>
          {getLabel(item)}
        </option>
      ))}
    </select>
  )
}