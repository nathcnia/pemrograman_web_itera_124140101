"""Contoh abstract class dan implementasi kontrak oleh subclass."""

from abc import ABC, abstractmethod


class Shape(ABC):
    """Kelas abstrak bentuk geometri."""

    @abstractmethod
    def area(self) -> float:
        """Hitung luas bentuk pada subclass konkret."""
        raise NotImplementedError


class Square(Shape):
    """Bentuk persegi yang mengimplementasikan Shape.area."""

    def __init__(self, side: float) -> None:
        """Simpan panjang sisi persegi."""
        self.side = side

    def area(self) -> float:
        """Kembalikan luas persegi."""
        return self.side**2


def main() -> None:
    """Buat object subclass dari abstract class Shape."""
    square = Square(4)
    print(f"Luas persegi: {square.area():.2f}")


if __name__ == "__main__":
    main()
