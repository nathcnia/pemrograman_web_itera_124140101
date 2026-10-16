import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import BookForm from '../components/BookForm';
import BookFilter from '../components/BookFilter';
import BookList from '../components/BookList';
import { useBooks } from '../context/BookContext';
import useBookStats from '../hooks/useBookStats';

export default function Home() {
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const stats = useBookStats(books);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const visibleBooks = useMemo(() => books.filter((book) => {
    const matchesFilter = activeFilter === 'all' || book.status === activeFilter;
    const query = search.trim().toLocaleLowerCase('id');
    const matchesSearch = !query || `${book.title} ${book.author}`.toLocaleLowerCase('id').includes(query);
    return matchesFilter && matchesSearch;
  }), [books, activeFilter, search]);

  const handleSave = (bookData) => {
    if (editingBook) updateBook(editingBook.id, bookData);
    else addBook(bookData);
    setEditingBook(null);
    setFormOpen(false);
  };

  const handleEdit = (bookId) => {
    setEditingBook(books.find((book) => book.id === bookId) ?? null);
    setFormOpen(true);
  };

  const handleDelete = (bookId) => {
    const book = books.find((item) => item.id === bookId);
    if (book && window.confirm(`Hapus “${book.title}” dari koleksi?`)) deleteBook(bookId);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingBook(null);
  };

  const counts = { all: stats.total, owned: stats.owned, reading: stats.reading, wishlist: stats.wishlist };

  return (
    <main className="page-content">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <p className="eyebrow">RUANG BACA PRIBADIMU</p>
          <h1>Setiap buku punya<br /><span>cerita untukmu.</span></h1>
          <p>Rapikan koleksi, catat bacaan, dan simpan buku yang ingin kamu temui berikutnya.</p>
          <button className="button button-light" type="button" onClick={() => { setEditingBook(null); setFormOpen(true); }}>
            <span aria-hidden="true">＋</span> Tambah buku
          </button>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="sparkle sparkle-one">✦</span><span className="sparkle sparkle-two">✧</span>
          <div className="art-book art-book-back" /><div className="art-book art-book-mid" />
          <div className="art-book art-book-front"><span>halaman<br />baru</span><i /></div>
          <span className="art-orbit" />
        </div>
        <div className="banner-index">01 <span>/ 03</span></div>
      </section>

      <section className="collection-section" aria-labelledby="collection-title">
        <div className="section-heading">
          <div><p className="eyebrow">KOLEKSI PERSONAL</p><h2 id="collection-title">Rak bukumu <span className="heading-count">{stats.total.toString().padStart(2, '0')}</span></h2></div>
          <div className="collection-tools">
            <label className="search-box">
              <span aria-hidden="true">⌕</span><span className="sr-only">Cari judul atau penulis</span>
              <input aria-label="Cari judul atau penulis" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari buku atau penulis..." />
              {search && <button type="button" aria-label="Hapus pencarian" onClick={() => setSearch('')}>×</button>}
            </label>
            <button className="button button-primary add-book-button" type="button" onClick={() => { setEditingBook(null); setFormOpen(true); }}>＋ <span>Tambah buku</span></button>
          </div>
        </div>
        <BookFilter activeFilter={activeFilter} counts={counts} onChange={setActiveFilter} />
        {visibleBooks.length === 0 && (books.length > 0 || search) ? (
          <div className="empty-library search-empty"><span className="empty-book" aria-hidden="true">⌕</span><h3>Buku tidak ditemukan</h3><p>Coba kata kunci lain atau ubah filter koleksimu.</p></div>
        ) : (
          <BookList books={visibleBooks} onEdit={handleEdit} onDelete={handleDelete} onAddFirst={() => setFormOpen(true)} />
        )}
      </section>

      {formOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}>
          <div className="form-modal" role="dialog" aria-modal="true" aria-labelledby="book-form-title">
            <BookForm key={editingBook?.id ?? 'new-book'} initialBook={editingBook} onSave={handleSave} onCancel={closeForm} />
          </div>
        </div>
      )}
    </main>
  );
}

Home.propTypes = {};
