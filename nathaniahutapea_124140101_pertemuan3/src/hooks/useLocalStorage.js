import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key);
      return savedValue === null ? initialValue : JSON.parse(savedValue);
    } catch (error) {
      console.warn(`Tidak bisa membaca ${key} dari localStorage:`, error);
      return initialValue;
    }
  });

  // Persist every state change so the collection survives reloads.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Tidak bisa menyimpan ${key} ke localStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
