import { createContext, useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';

const BookContext = createContext(null);
export const BOOK_STORAGE_KEY = 'saku-buku-library';

function createBookId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage(BOOK_STORAGE_KEY, []);

  // Immutable array updates keep Context consumers in sync with the saved library.
  const addBook = useCallback((bookData) => {
    const newBook = {
      ...bookData,
      id: createBookId(),
      createdAt: new Date().toISOString(),
    };
    setBooks((currentBooks) => [newBook, ...currentBooks]);
    return newBook;
  }, [setBooks]);

  const updateBook = useCallback((bookId, changes) => {
    setBooks((currentBooks) => currentBooks.map((book) => (
      book.id === bookId
        ? { ...book, ...changes, id: book.id, updatedAt: new Date().toISOString() }
        : book
    )));
  }, [setBooks]);

  const deleteBook = useCallback((bookId) => {
    setBooks((currentBooks) => currentBooks.filter((book) => book.id !== bookId));
  }, [setBooks]);

  const value = useMemo(() => ({ books, addBook, updateBook, deleteBook }), [books, addBook, updateBook, deleteBook]);

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBooks harus digunakan di dalam BookProvider.');
  return context;
}
