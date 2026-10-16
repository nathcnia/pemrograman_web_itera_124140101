import PropTypes from 'prop-types';
import { STATUS_LABELS, bookShape } from '../bookTypes';

const coverTones = ['cover-blue', 'cover-violet', 'cover-mint', 'cover-coral', 'cover-navy'];

function getCoverTone(id) {
  const hash = [...id].reduce((total, character) => total + character.charCodeAt(0), 0);
  return coverTones[hash % coverTones.length];
}

export default function BookCard({ book, onEdit, onDelete }) {
  return (
    <article className="book-card">
      <div className={`book-cover ${getCoverTone(book.id)}`} aria-hidden="true">
        <span className="cover-mark">S</span>
        <span className="cover-lines"><i /><i /><i /></span>
      </div>
      <div className="book-card-content">
        <div className="book-card-topline">
          <span className={`status-badge status-${book.status}`}>{STATUS_LABELS[book.status]}</span>
          <div className="book-actions">
            <button className="icon-button" type="button" onClick={() => onEdit(book.id)} aria-label={`Edit ${book.title}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5 5 5M4 20l4.2-.9L19 8.3 15.7 5 4.9 15.8z" /></svg>
            </button>
            <button className="icon-button delete-button" type="button" onClick={() => onDelete(book.id)} aria-label={`Hapus ${book.title}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
            </button>
          </div>
        </div>
        <h3>{book.title}</h3>
        <p className="book-author">oleh {book.author}</p>
        {book.genre && <span className="genre-label">{book.genre}</span>}
        {book.notes && <p className="book-notes">“{book.notes}”</p>}
      </div>
    </article>
  );
}

BookCard.propTypes = {
  book: bookShape.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
