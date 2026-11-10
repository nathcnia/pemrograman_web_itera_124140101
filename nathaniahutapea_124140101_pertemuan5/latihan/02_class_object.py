"""Contoh pembuatan class dan beberapa object buku."""


class Book:
    """Model buku dengan judul dan penulis."""

    def __init__(self, title: str, author: str) -> None:
        """Inisialisasi identitas buku."""
        self.title = title
        self.author = author

    def describe(self) -> str:
        """Kembalikan ringkasan informasi buku."""
        return f"{self.title} — {self.author}"


def main() -> None:
    """Buat dan tampilkan dua object buku."""
    books = [
        Book("Laut Bercerita", "Leila S. Chudori"),
        Book("Filosofi Teras", "Henry Manampiring"),
    ]
    for book in books:
        print(book.describe())


if __name__ == "__main__":
    main()
