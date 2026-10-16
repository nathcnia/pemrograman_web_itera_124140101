import PropTypes from 'prop-types';

const filters = [
  { id: 'all', label: 'Semua buku' },
  { id: 'owned', label: 'Dimiliki' },
  { id: 'reading', label: 'Sedang dibaca' },
  { id: 'wishlist', label: 'Ingin dibeli' },
];

export default function BookFilter({ activeFilter, counts, onChange }) {
  return (
    <div className="filter-tabs" role="group" aria-label="Filter koleksi buku">
      {filters.map(({ id, label }) => (
        <button
          className={`filter-tab ${activeFilter === id ? 'is-active' : ''}`}
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={activeFilter === id}
        >
          {label}<span>{counts[id]}</span>
        </button>
      ))}
    </div>
  );
}

BookFilter.propTypes = {
  activeFilter: PropTypes.oneOf(filters.map(({ id }) => id)).isRequired,
  counts: PropTypes.shape({
    all: PropTypes.number.isRequired,
    owned: PropTypes.number.isRequired,
    reading: PropTypes.number.isRequired,
    wishlist: PropTypes.number.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
