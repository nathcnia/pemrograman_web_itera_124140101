"""Demonstrasi sistem manajemen perpustakaan berbasis OOP."""

from library import Library
from library_item import Book, Magazine
from member import Member


def main() -> None:
    """Tambahkan item, cari judul/ID, dan demonstrasikan peminjaman."""
    library = Library("Perpustakaan ITERA")
    items = [
        Book("BK001", "Belajar Python", "Budi Raharjo"),
        Book("BK002", "Algoritma dan Struktur Data", "Rina Pratiwi"),
        Magazine("MG001", "Teknologi Kampus", "Edisi Oktober 2026"),
    ]
    for item in items:
        library.tambah_item(item)
        print(f"Item ditambahkan: {item.item_id} - {item.title}")

    member = Member("AG001", "Nathania Hutapea")
    library.daftarkan_anggota(member)
    print(f"\nAnggota terdaftar: {member.name} ({member.member_id})")

    print("\nPencarian berdasarkan judul 'Python':")
    found_by_title = library.cari_item("Python")
    if found_by_title:
        print(f"Ditemukan: {found_by_title.item_id} - {found_by_title.title}")
        print(f"Detail   : {found_by_title.get_detail()}")

    print("\nPencarian berdasarkan ID 'MG001':")
    found_by_id = library.cari_item("MG001")
    if found_by_id:
        print(f"Ditemukan: {found_by_id.item_id} - {found_by_id.title}")
        print(f"Detail   : {found_by_id.get_detail()}")

    print("\nKatalog awal:")
    library.tampilkan_katalog()

    print("\nDemonstrasi ketersediaan:")
    selected_item = library.cari_item("BK001")
    if library.pinjamkan(member.member_id, "BK001"):
        print(f"{selected_item.title} berhasil dipinjam oleh {member.name}.")
        print(f"Sedang dipinjam: {selected_item.is_dipinjam}")
    else:
        print("Peminjaman gagal.")

    print("\nKatalog item tersedia setelah peminjaman:")
    library.tampilkan_katalog(tersedia_saja=True)

    fine = library.kembalikan_item(member.member_id, "BK001", hari_terlambat=2)
    print(f"\nBuku dikembalikan. Denda keterlambatan 2 hari: Rp{fine:,}.")
    print(f"Tersedia setelah dikembalikan: {not selected_item.is_dipinjam}")


if __name__ == "__main__":
    main()
