"""Perbandingan sederhana gaya prosedural dengan pendekatan OOP."""


def procedural_total(price: int, quantity: int) -> int:
    """Hitung total belanja melalui fungsi prosedural."""
    return price * quantity


class CartItem:
    """Simpan harga dan jumlah barang dalam satu objek."""

    def __init__(self, price: int, quantity: int) -> None:
        """Atur harga satuan dan jumlah barang."""
        self.price = price
        self.quantity = quantity

    def total(self) -> int:
        """Hitung subtotal berdasarkan data di objek."""
        return self.price * self.quantity


def main() -> None:
    """Bandingkan pemanggilan fungsi dan method objek."""
    print("=== Prosedural dan OOP ===")
    print(f"Prosedural: {procedural_total(12_000, 3):,} rupiah")

    item = CartItem(12_000, 3)
    print(f"OOP       : {item.total():,} rupiah")


if __name__ == "__main__":
    main()
