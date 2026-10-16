import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { BOOK_STATUSES, STATUS_LABELS, bookShape } from '../bookTypes';

const EMPTY_BOOK = {
  title: '',
  author: '',
  status: 'owned',
  genre: '',
  notes: '',
};

export default function BookForm({ initialBook = null, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY_BOOK, ...initialBook }));
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(initialBook);

  useEffect(() => {
    setForm({ ...EMPTY_BOOK, ...initialBook });
    setErrors({});
  }, [initialBook]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Judul buku wajib diisi.';
    if (!form.author.trim()) nextErrors.author = 'Nama penulis wajib diisi.';
    if (!BOOK_STATUSES.includes(form.status)) nextErrors.status = 'Pilih status buku.';

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSave({
      title: form.title.trim(),
      author: form.author.trim(),
      status: form.status,
      genre: form.genre.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-heading">
        <div>
          <p className="eyebrow">{isEditing ? 'PERBARUI KOLEKSI' : 'CATAT BUKU BARU'}</p>
          <h2 id="book-form-title">{isEditing ? 'Edit detail buku' : 'Tambah ke rak bukumu'}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onCancel} aria-label="Tutup formulir">×</button>
      </div>
      <label className={`form-field ${errors.title ? 'has-error' : ''}`} htmlFor="book-title">
        Judul buku <span>*</span>
        <input id="book-title" name="title" value={form.title} onChange={handleChange} placeholder="Contoh: Laut Bercerita" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'title-error' : undefined} />
        {errors.title && <small id="title-error" className="field-error">{errors.title}</small>}
      </label>
      <label className={`form-field ${errors.author ? 'has-error' : ''}`} htmlFor="book-author">
        Nama penulis <span>*</span>
        <input id="book-author" name="author" value={form.author} onChange={handleChange} placeholder="Contoh: Leila S. Chudori" aria-invalid={Boolean(errors.author)} aria-describedby={errors.author ? 'author-error' : undefined} />
        {errors.author && <small id="author-error" className="field-error">{errors.author}</small>}
      </label>
      <div className="form-row">
        <label className="form-field" htmlFor="book-status">
          Status buku <span>*</span>
          <select id="book-status" name="status" value={form.status} onChange={handleChange}>
            {BOOK_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
          </select>
          {errors.status && <small className="field-error">{errors.status}</small>}
        </label>
        <label className="form-field" htmlFor="book-genre">
          Genre
          <input id="book-genre" name="genre" value={form.genre} onChange={handleChange} placeholder="Fiksi, pengembangan diri…" />
        </label>
      </div>
      <label className="form-field" htmlFor="book-notes">
        Catatan pribadi
        <textarea id="book-notes" name="notes" rows="3" value={form.notes} onChange={handleChange} placeholder="Kesan, kutipan, atau alasan ingin membacanya" />
      </label>
      <div className="form-actions">
        <button className="button button-quiet" type="button" onClick={onCancel}>Batal</button>
        <button className="button button-primary" type="submit">{isEditing ? 'Simpan perubahan' : 'Simpan buku'} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  );
}

BookForm.propTypes = {
  initialBook: bookShape,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
