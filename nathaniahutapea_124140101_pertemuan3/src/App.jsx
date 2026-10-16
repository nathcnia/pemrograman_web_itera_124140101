import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Stats from './pages/Stats';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app-shell">
      <Navigation />
      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb"><span>Ruang pribadi</span><span aria-hidden="true">/</span><strong>Saku Buku</strong></div>
          <div className="topbar-right"><span className="today-label">Perpustakaan personal</span><span className="topbar-avatar" aria-label="Profil Nathania">N</span></div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <footer className="app-footer"><span>© 2026 Saku Buku</span><span>Dibuat dengan tenang, untuk cerita yang tak terbatas <i>✦</i></span></footer>
      </div>
    </div>
  );
}

App.propTypes = {};
