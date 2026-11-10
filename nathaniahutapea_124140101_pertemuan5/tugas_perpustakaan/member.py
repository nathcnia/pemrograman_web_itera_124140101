"""Model anggota perpustakaan dan daftar peminjaman pribadinya."""

from library_item import LibraryItem


class Member:
    """Anggota yang mengelola item-item yang sedang dipinjam."""

    def __init__(self, member_id: str, name: str) -> None:
        """Buat anggota baru dengan identitas unik.

        Args:
            member_id: Kode unik anggota.
            name: Nama anggota perpustakaan.
        """
        if not member_id.strip() or not name.strip():
            raise ValueError("ID dan nama anggota wajib diisi.")
        self.__member_id = member_id.strip()
        self.__name = name.strip()
        self.__borrowed_item_ids: list[str] = []

    @property
    def member_id(self) -> str:
        """Kembalikan ID anggota."""
        return self.__member_id

    @property
    def name(self) -> str:
        """Kembalikan nama anggota."""
        return self.__name

    @property
    def borrowed_item_ids(self) -> tuple[str, ...]:
        """Kembalikan salinan immutable dari ID item yang dipinjam."""
        return tuple(self.__borrowed_item_ids)

    def pinjam_item(self, item: LibraryItem) -> bool:
        """Pinjam item yang masih tersedia dan catat ID-nya.

        Args:
            item: Item perpustakaan yang akan dipinjam.

        Returns:
            True jika peminjaman berhasil; False jika item tidak tersedia.
        """
        if not item.pinjam():
            return False
        self.__borrowed_item_ids.append(item.item_id)
        return True

    def kembalikan_item(self, item: LibraryItem) -> bool:
        """Kembalikan item yang tercatat pada anggota ini.

        Args:
            item: Item yang sebelumnya dipinjam oleh anggota.

        Returns:
            True jika pengembalian berhasil. False jika item tidak terdaftar
            pada anggota atau statusnya tidak dipinjam.
        """
        if item.item_id not in self.__borrowed_item_ids:
            return False
        if not item.kembalikan():
            return False
        self.__borrowed_item_ids.remove(item.item_id)
        return True
