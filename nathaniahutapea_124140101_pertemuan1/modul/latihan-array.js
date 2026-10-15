const produk = [
  { nama: 'Kopi susu', harga: 15_000, stok: 12 },
  { nama: 'Roti bakar', harga: 12_000, stok: 0 },
  { nama: 'Air mineral', harga: 5_000, stok: 24 },
  { nama: 'Nasi ayam', harga: 18_000, stok: 7 },
];

const daftarProduk = document.querySelector('#product-list');
const barisProduk = produk.map((item) => {
  const baris = document.createElement('tr');
  [item.nama, `Rp${item.harga.toLocaleString('id-ID')}`, item.stok > 0 ? 'Tersedia' : 'Habis']
    .forEach((teks) => {
      const sel = document.createElement('td');
      sel.textContent = teks;
      baris.append(sel);
    });
  return baris;
});

daftarProduk.append(...barisProduk);

const produkTersedia = produk.filter((item) => item.stok > 0);
const totalNilaiStok = produkTersedia.reduce((total, item) => total + item.harga * item.stok, 0);
document.querySelector('#summary').textContent = `${produkTersedia.length} dari ${produk.length} produk tersedia. Total nilai stok yang tersedia: Rp${totalNilaiStok.toLocaleString('id-ID')}.`;
