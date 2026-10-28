export default function MultiSelect({ label, values, selected, onChange }) {
  function toggle(value) {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  }

  return (
    <details className="multi-select">
      <summary>{selected.length ? `${label} (${selected.length})` : label}</summary>
      <div className="multi-select-menu">
        {values.map((value) => (
          <label key={value}>
            <input type="checkbox" checked={selected.includes(value)} onChange={() => toggle(value)} />
            <span>{value}</span>
          </label>
        ))}
      </div>
    </details>
  );
}
