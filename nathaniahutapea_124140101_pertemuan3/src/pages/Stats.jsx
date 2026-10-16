import PropTypes from 'prop-types';
import StatCard from '../components/StatCard';
import { useBooks } from '../context/BookContext';
import useBookStats from '../hooks/useBookStats';
import { STATUS_LABELS } from '../bookTypes';

const statusRows = [
  { key: 'owned', tone: 'owned', icon: '▤', description: 'Buku yang sudah ada di rakmu' },
  { key: 'reading', tone: 'reading', icon: '◷', description: 'Bacaan yang sedang menemanimu' },
  { key: 'wishlist', tone: 'wishlist', icon: '♡', description: 'Judul yang ingin kamu miliki' },
];

export default function Stats() {
  const { books } = useBooks();
  const stats = useBookStats(books);
  const progress = stats.total ? Math.round((stats.reading / stats.total) * 100) : 0;

  return (
    <main className="page-content stats-page">
      <header className="page-title-block">
        <p className="eyebrow">JEJAK PERJALANAN MEMBACA</p>
        <h1>Statistik <span>bacaanmu.</span></h1>
        <p>Perjalanan membaca dimulai dari satu halaman. Lihat koleksi yang sedang kamu bangun.</p>
      </header>
      <section className="stats-overview" aria-label="Ringkasan koleksi">
        <StatCard label="Total koleksi" value={stats.total} detail="judul tersimpan" icon="▤" tone="sky" />
        <StatCard label="Di perpustakaan" value={stats.inLibrary} detail="dimiliki dan dibaca" icon="⌂" tone="mint" />
        <StatCard label="Sedang dibaca" value={stats.reading} detail={`${progress}% dari koleksi`} icon="◷" tone="lavender" />
      </section>
      <section className="stats-detail-grid">
        <div className="status-breakdown panel-card">
          <div className="panel-heading"><div><p className="eyebrow">RINGKASAN STATUS</p><h2>Isi rak bukumu</h2></div><span className="panel-icon">✦</span></div>
          <div className="status-list">
            {statusRows.map(({ key, tone, icon, description }) => {
              const percentage = stats.total ? Math.round((stats[key] / stats.total) * 100) : 0;
              return (
                <div className="status-row" key={key}>
                  <span className={`status-symbol ${tone}`} aria-hidden="true">{icon}</span>
                  <div className="status-row-main"><div className="status-row-label"><strong>{STATUS_LABELS[key]}</strong><span>{stats[key]} buku · {percentage}%</span></div><div className="progress-track"><span className={`progress-fill ${tone}`} style={{ width: `${percentage}%` }} /></div><small>{description}</small></div>
                </div>
              );
            })}
          </div>
        </div>
        <aside className="reading-quote panel-card">
          <div className="quote-mark" aria-hidden="true">“</div>
          <p className="eyebrow">CATATAN KECIL</p>
          <blockquote>“Membaca adalah perjalanan yang bisa dimulai kapan saja, dari mana saja.”</blockquote>
          <span className="quote-rule" />
          <p className="quote-caption">Terus kumpulkan halaman-halaman baikmu.</p>
          <span className="quote-decoration" aria-hidden="true">✦</span>
        </aside>
      </section>
      <section className="recent-books panel-card">
        <div className="panel-heading"><div><p className="eyebrow">TAMBAHAN TERAKHIR</p><h2>Catatan terbarumu</h2></div><span className="recent-total">{books.length} buku</span></div>
        {books.length === 0 ? <p className="stats-empty">Belum ada buku yang dicatat. Tambahkan judul pertama dari halaman koleksi.</p> : (
          <div className="recent-list">
            {books.slice(0, 5).map((book) => <article className="recent-book-row" key={book.id}><span className="mini-book-icon" aria-hidden="true">▤</span><div><strong>{book.title}</strong><span>{book.author}</span></div><span className={`status-badge status-${book.status}`}>{STATUS_LABELS[book.status]}</span></article>)}
          </div>
        )}
      </section>
    </main>
  );
}

Stats.propTypes = {};
