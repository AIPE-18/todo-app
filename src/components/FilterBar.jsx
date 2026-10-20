function FilterBar({ filter, onChange }) {
  const options = ["all", "active", "completed"];

  return (
    <div className="filters">
      {options.map((option) => (
        <button
          key={option}
          className={filter === option ? "active" : ""}
          onClick={() => onChange(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;