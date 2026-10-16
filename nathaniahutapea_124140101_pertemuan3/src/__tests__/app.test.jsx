import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { BookProvider, BOOK_STORAGE_KEY } from '../context/BookContext';

const renderApp = (initialEntry = '/') => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <BookProvider><App /></BookProvider>
  </MemoryRouter>,
);

const addBook = async (user, { title = 'Laut Bercerita', author = 'Leila S. Chudori', status = 'owned' } = {}) => {
  await user.click(screen.getAllByRole('button', { name: /Tambah buku/ })[0]);
  await user.type(screen.getByLabelText(/Judul buku/), title);
  await user.type(screen.getByLabelText(/Nama penulis/), author);
  await user.selectOptions(screen.getByLabelText(/Status buku/), status);
  await user.click(screen.getByRole('button', { name: 'Simpan buku' }));
};

beforeEach(() => {
  window.localStorage.clear();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Saku Buku', () => {
  it('menampilkan feedback validasi untuk judul dan penulis kosong', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getAllByRole('button', { name: /Tambah buku/ })[0]);
    await user.click(screen.getByRole('button', { name: 'Simpan buku' }));

    expect(screen.getByText('Judul buku wajib diisi.')).toBeInTheDocument();
    expect(screen.getByText('Nama penulis wajib diisi.')).toBeInTheDocument();
    expect(window.localStorage.getItem(BOOK_STORAGE_KEY)).toBe('[]');
  });

  it('menambahkan buku baru dan langsung menampilkannya di koleksi', async () => {
    const user = userEvent.setup();
    renderApp();
    await addBook(user);

    expect(screen.getByRole('heading', { name: 'Laut Bercerita' })).toBeInTheDocument();
    expect(screen.getByText('oleh Leila S. Chudori')).toBeInTheDocument();
    expect(screen.getByText('Dimiliki', { selector: '.status-badge' })).toBeInTheDocument();
  });

  it('mencari buku berdasarkan penulis dan memfilter berdasarkan status', async () => {
    const user = userEvent.setup();
    renderApp();
    await addBook(user, { title: 'Laut Bercerita', author: 'Leila Chudori', status: 'reading' });
    await addBook(user, { title: 'Bumi Manusia', author: 'Pramoedya Ananta Toer', status: 'owned' });

    await user.type(screen.getByRole('textbox', { name: 'Cari judul atau penulis' }), 'Pramoedya');
    expect(screen.getByRole('heading', { name: 'Bumi Manusia' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Laut Bercerita' })).not.toBeInTheDocument();
    await user.clear(screen.getByRole('textbox', { name: 'Cari judul atau penulis' }));
    await user.click(screen.getByRole('button', { name: /Sedang dibaca/ }));
    expect(screen.getByRole('heading', { name: 'Laut Bercerita' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Bumi Manusia' })).not.toBeInTheDocument();
  });

  it('mengedit dan menghapus buku dari koleksi', async () => {
    const user = userEvent.setup();
    renderApp();
    await addBook(user);
    await user.click(screen.getByRole('button', { name: 'Edit Laut Bercerita' }));
    const titleInput = screen.getByLabelText(/Judul buku/);
    await user.clear(titleInput);
    await user.type(titleInput, 'Laut Bercerita Edisi Baru');
    await user.click(screen.getByRole('button', { name: 'Simpan perubahan' }));

    expect(screen.getByRole('heading', { name: 'Laut Bercerita Edisi Baru' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Hapus Laut Bercerita Edisi Baru' }));
    expect(window.confirm).toHaveBeenCalledOnce();
    expect(screen.queryByRole('heading', { name: 'Laut Bercerita Edisi Baru' })).not.toBeInTheDocument();
  });

  it('menyimpan koleksi ke localStorage dan memuatnya kembali', async () => {
    const user = userEvent.setup();
    const firstRender = renderApp();
    await addBook(user);
    expect(JSON.parse(window.localStorage.getItem(BOOK_STORAGE_KEY))).toHaveLength(1);
    firstRender.unmount();

    renderApp();
    expect(screen.getByRole('heading', { name: 'Laut Bercerita' })).toBeInTheDocument();
  });

  it('menampilkan ringkasan statistik buku menurut status', async () => {
    const user = userEvent.setup();
    renderApp();
    await addBook(user, { title: 'Laut Bercerita', status: 'reading' });
    await user.click(screen.getByRole('link', { name: /Statistik membaca/ }));

    expect(screen.getByRole('heading', { name: 'Statistik bacaanmu.' })).toBeInTheDocument();
    const summary = screen.getByRole('region', { name: 'Ringkasan koleksi' });
    expect(within(summary).getAllByText('1', { selector: 'strong' })).toHaveLength(3);
    expect(screen.getByText('Sedang dibaca', { selector: '.status-row-label strong' })).toBeInTheDocument();
  });
});
