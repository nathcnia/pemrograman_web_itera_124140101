"""Katalog perpustakaan dan operasi pengelolaan item/anggota."""

from library_item import LibraryItem
from member import Member


class Library:
    """Kelola katalog item dan anggota dengan koleksi privat."""

    def __init__(self, name: str) -> None:
        """Inisialisasi perpustakaan dengan katalog dan daftar anggota kosong.

        Args:
            name: Nama perpustakaan.
        """
        self.__name = name
        self.__koleksi: dict[str, LibraryItem] = {}
        self.__anggota: dict[str, Member] = {}

    @property
    def name(self) -> str:
        """Kembalikan nama perpustakaan."""
        return self.__name

    @property
    def jumlah_item(self) -> int:
        """Kembalikan jumlah seluruh item dalam katalog."""
        return len(self.__koleksi)

    def tambah_item(self, item: LibraryItem) -> None:
        """Tambahkan item ke katalog dan cegah ID duplikat.

        Args:
            item: Object LibraryItem atau subclass yang akan ditambahkan.

        Raises:
            ValueError: Jika ID item telah ada dalam katalog.
        """
        if item.item_id in self.__koleksi:
            raise ValueError(f"ID {item.item_id} sudah terdaftar.")
        self.__koleksi[item.item_id] = item

    def daftarkan_anggota(self, member: Member) -> None:
        """Tambahkan anggota baru dan cegah ID anggota duplikat.

        Args:
            member: Object Member yang akan didaftarkan.

        Raises:
            ValueError: Jika ID anggota telah terdaftar.
        """
        if member.member_id in self.__anggota:
            raise ValueError(f"ID anggota {member.member_id} sudah terdaftar.")
        self.__anggota[member.member_id] = member

    def tampilkan_katalog(self, tersedia_saja: bool = False) -> None:
        """Cetak katalog; polymorphism menampilkan detail tiap subclass.

        Args:
            tersedia_saja: Jika True, tampilkan item yang tidak dipinjam saja.
        """
        items = list(self.__koleksi.values())
        if tersedia_saja:
            items = [item for item in items if not item.is_dipinjam]

        print(f"\nKatalog {self.name} ({len(items)} item)")
        header = f"{'ID':<7} | {'Judul':<27} | {'Jenis / Detail':<42} | Status"
        print(header)
        print("-" * 94)
        if not items:
            print("Belum ada item yang sesuai.")
            return

        for item in items:
            status = "Dipinjam" if item.is_dipinjam else "Tersedia"
            detail = item.get_detail()[:42]
            print(
                f"{item.item_id:<7} | {item.title[:27]:<27} | "
                f"{detail:<42} | {status}"
            )

    def cari_item(self, query: str) -> LibraryItem | None:
        """Cari item dengan ID persis atau judul yang memuat kata kunci.

        Args:
            query: ID atau sebagian judul item.

        Returns:
            Item pertama yang cocok, atau None jika tidak ditemukan.
        """
        normalized_query = query.strip().casefold()
        if not normalized_query:
            return None

        for item in self.__koleksi.values():
            if (
                item.item_id.casefold() == normalized_query
                or normalized_query in item.title.casefold()
            ):
                return item
        return None

    def pinjamkan(self, member_id: str, item_id: str) -> bool:
        """Proses peminjaman item oleh anggota terdaftar.

        Args:
            member_id: ID anggota yang meminjam.
            item_id: ID item yang akan dipinjam.

        Returns:
            True jika transaksi berhasil; False jika ID tidak valid atau item
            sedang dipinjam.
        """
        member = self.__anggota.get(member_id)
        item = self.__koleksi.get(item_id)
        if member is None or item is None:
            return False
        return member.pinjam_item(item)

    def kembalikan_item(
        self,
        member_id: str,
        item_id: str,
        hari_terlambat: int = 0,
    ) -> int | None:
        """Proses pengembalian item dan kembalikan denda polymorphic.

        Args:
            member_id: ID anggota yang mengembalikan.
            item_id: ID item yang dikembalikan.
            hari_terlambat: Jumlah hari keterlambatan pengembalian.

        Returns:
            Nilai denda dalam rupiah, atau None jika transaksi tidak valid.
        """
        if hari_terlambat < 0:
            raise ValueError("Hari terlambat tidak boleh negatif.")
        member = self.__anggota.get(member_id)
        item = self.__koleksi.get(item_id)
        if member is None or item is None:
            return None
        if not member.kembalikan_item(item):
            return None
        return item.hitung_denda(hari_terlambat)
