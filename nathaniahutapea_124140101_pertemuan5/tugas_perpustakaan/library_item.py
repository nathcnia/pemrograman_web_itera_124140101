"""Definisi abstract item perpustakaan dan subclass buku/majalah."""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Kelas dasar abstrak yang mendefinisikan kontrak item perpustakaan."""

    def __init__(self, item_id: str, title: str) -> None:
        """Inisialisasi id, judul, dan status peminjaman item.

        Args:
            item_id: Kode unik item perpustakaan.
            title: Judul item yang akan ditampilkan di katalog.
        """
        if not item_id.strip() or not title.strip():
            raise ValueError("ID dan judul item wajib diisi.")
        self.__item_id = item_id.strip()
        self.__title = title.strip()
        self.__is_dipinjam = False

    @property
    def item_id(self) -> str:
        """Kembalikan ID item tanpa membuka akses untuk mengubahnya."""
        return self.__item_id

    @property
    def title(self) -> str:
        """Kembalikan judul item yang tersimpan."""
        return self.__title

    @property
    def is_dipinjam(self) -> bool:
        """Tampilkan status peminjaman item secara read-only."""
        return self.__is_dipinjam

    def pinjam(self) -> bool:
        """Tandai item sebagai dipinjam jika saat ini tersedia.

        Returns:
            True jika status berhasil diubah; False jika sudah dipinjam.
        """
        if self.__is_dipinjam:
            return False
        self.__is_dipinjam = True
        return True

    def kembalikan(self) -> bool:
        """Tandai item kembali tersedia jika sedang dipinjam.

        Returns:
            True jika status berhasil diubah; False jika sudah tersedia.
        """
        if not self.__is_dipinjam:
            return False
        self.__is_dipinjam = False
        return True

    @abstractmethod
    def get_detail(self) -> str:
        """Kembalikan detail item; wajib diimplementasikan subclass."""
        raise NotImplementedError

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> int:
        """Hitung denda keterlambatan; rumus ditentukan subclass."""
        raise NotImplementedError

    def __str__(self) -> str:
        """Kembalikan representasi item untuk kebutuhan debugging."""
        return f"{self.item_id} - {self.title}"


class Book(LibraryItem):
    """Item buku dengan penulis dan tarif denda per hari."""

    DENDA_PER_HARI = 2_000

    def __init__(self, item_id: str, title: str, author: str) -> None:
        """Buat buku dengan kode, judul, dan nama penulis.

        Args:
            item_id: Kode unik buku.
            title: Judul buku.
            author: Nama penulis buku.
        """
        super().__init__(item_id, title)
        if not author.strip():
            raise ValueError("Nama penulis wajib diisi.")
        self.__author = author.strip()

    @property
    def author(self) -> str:
        """Kembalikan nama penulis buku."""
        return self.__author

    def get_detail(self) -> str:
        """Kembalikan detail buku untuk katalog perpustakaan."""
        return f"Buku | Penulis: {self.author}"

    def hitung_denda(self, hari_terlambat: int) -> int:
        """Hitung denda buku sebesar Rp2.000 per hari terlambat.

        Args:
            hari_terlambat: Jumlah hari pengembalian melewati tenggat.

        Returns:
            Total denda dalam rupiah.
        """
        if hari_terlambat < 0:
            raise ValueError("Hari terlambat tidak boleh negatif.")
        return hari_terlambat * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    """Item majalah dengan nomor edisi dan tarif denda per hari."""

    DENDA_PER_HARI = 1_500

    def __init__(self, item_id: str, title: str, issue_number: str) -> None:
        """Buat majalah dengan kode, judul, dan nomor edisi.

        Args:
            item_id: Kode unik majalah.
            title: Judul majalah.
            issue_number: Nomor atau bulan edisi majalah.
        """
        super().__init__(item_id, title)
        if not issue_number.strip():
            raise ValueError("Nomor edisi wajib diisi.")
        self.__issue_number = issue_number.strip()

    @property
    def issue_number(self) -> str:
        """Kembalikan nomor edisi majalah."""
        return self.__issue_number

    def get_detail(self) -> str:
        """Kembalikan detail majalah untuk katalog perpustakaan."""
        return f"Majalah | Edisi: {self.issue_number}"

    def hitung_denda(self, hari_terlambat: int) -> int:
        """Hitung denda majalah sebesar Rp1.500 per hari terlambat.

        Args:
            hari_terlambat: Jumlah hari pengembalian melewati tenggat.

        Returns:
            Total denda dalam rupiah.
        """
        if hari_terlambat < 0:
            raise ValueError("Hari terlambat tidak boleh negatif.")
        return hari_terlambat * self.DENDA_PER_HARI
