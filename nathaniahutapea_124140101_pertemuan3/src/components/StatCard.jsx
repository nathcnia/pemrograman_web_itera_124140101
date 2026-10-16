import PropTypes from 'prop-types';

export default function StatCard({ label, value, detail, icon, tone = 'sky' }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <span className="stat-icon" aria-hidden="true">{icon}</span>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  );
}

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  detail: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(['sky', 'mint', 'lavender']),
};
