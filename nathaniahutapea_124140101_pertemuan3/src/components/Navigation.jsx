import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { useBooks } from '../context/BookContext';
import useBookStats from '../hooks/useBookStats';

export default function Navigation() {
  const { books } = useBooks();
  const stats = useBookStats(books);

  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/" aria-label="Saku Buku, beranda">
        <span className="brand-mark" aria-hidden="true">sb</span>
        <span>saku<span>buku</span><i>.</i></span>
      </NavLink>
      <p className="sidebar-caption">PERPUSTAKAANMU</p>
      <nav className="main-nav" aria-label="Navigasi utama">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon" aria-hidden="true">▤</span> Koleksi buku <span className="nav-count">{stats.total}</span>
        </NavLink>
        <NavLink to="/stats" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span className="nav-icon" aria-hidden="true">◷</span> Statistik membaca
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="reading-note"><span aria-hidden="true">✦</span><p>Satu halaman hari ini<br /><strong>jadi cerita esok hari.</strong></p></div>
        <div className="profile-chip"><span className="profile-avatar">N</span><span><strong>Nathania</strong><small>Mahasiswa ITERA</small></span><span className="profile-dot" /></div>
      </div>
    </aside>
  );
}

Navigation.propTypes = {};
