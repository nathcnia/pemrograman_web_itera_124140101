import PropTypes from 'prop-types';
import BookCard from './BookCard';
import { bookShape } from '../bookTypes';

export default function BookList({ books, onEdit, onDelete, onAddFirst }) {
  if (books.length === 0) {
    return (
      <div className="empty-library">
        <span className="empty-book" aria-hidden="true">✧</span>
        <h3>Rak ini masih kosong</h3>
        <p>Tambahkan buku pertama dan mulai bangun perpustakaan kecilmu.</p>
        <button className="button button-primary" type="button" onClick={onAddFirst}>Tambah buku pertama <span aria-hidden="true">→</span></button>
      </div>
    );
  }

  return (
    <div className="book-grid">
      {books.map((book) => <BookCard key={book.id} book={book} onEdit={onEdit} onDelete={onDelete} />)}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(bookShape).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddFirst: PropTypes.func.isRequired,
};
