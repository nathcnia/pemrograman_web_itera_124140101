import PropTypes from 'prop-types';

export const BOOK_STATUSES = ['owned', 'reading', 'wishlist'];

export const STATUS_LABELS = {
  owned: 'Dimiliki',
  reading: 'Sedang dibaca',
  wishlist: 'Ingin dibeli',
};

export const bookShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  status: PropTypes.oneOf(BOOK_STATUSES).isRequired,
  genre: PropTypes.string,
  notes: PropTypes.string,
  createdAt: PropTypes.string,
});
