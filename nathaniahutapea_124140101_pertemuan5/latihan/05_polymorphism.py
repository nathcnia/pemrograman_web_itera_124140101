"""Contoh polymorphism melalui method yang sama pada beberapa class."""


class Book:
    """Representasikan buku yang dapat dideskripsikan."""

    def describe(self) -> str:
        """Kembalikan deskripsi buku."""
        return "Buku: belajar Python dengan latihan"


class Magazine:
    """Representasikan majalah yang dapat dideskripsikan."""

    def describe(self) -> str:
        """Kembalikan deskripsi majalah."""
        return "Majalah: edisi teknologi kampus"


def print_description(items: list[Book | Magazine]) -> None:
    """Panggil method describe pada object dengan tipe berbeda."""
    for item in items:
        print(item.describe())


def main() -> None:
    """Jalankan contoh polymorphism."""
    print_description([Book(), Magazine()])


if __name__ == "__main__":
    main()
