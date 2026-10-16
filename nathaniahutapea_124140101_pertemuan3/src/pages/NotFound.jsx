import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="page-content not-found-page">
      <p className="eyebrow">HALAMAN TIDAK DITEMUKAN</p>
      <h1>Sepertinya halaman ini <span>belum ada di rak.</span></h1>
      <Link className="button button-primary" to="/">Kembali ke koleksi <span aria-hidden="true">→</span></Link>
    </main>
  );
}

NotFound.propTypes = {};
