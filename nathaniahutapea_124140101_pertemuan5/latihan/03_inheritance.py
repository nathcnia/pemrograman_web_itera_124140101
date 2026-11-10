"""Contoh inheritance dengan parent Animal dan turunannya."""


class Animal:
    """Kelas dasar untuk hewan."""

    def __init__(self, name: str) -> None:
        """Simpan nama hewan."""
        self.name = name

    def sound(self) -> str:
        """Berikan suara umum yang dapat dioverride subclass."""
        return "Suara hewan"


class Cat(Animal):
    """Kucing mewarisi atribut dasar Animal."""

    def sound(self) -> str:
        """Kembalikan suara kucing."""
        return "Meong"


class Dog(Animal):
    """Anjing mewarisi atribut dasar Animal."""

    def sound(self) -> str:
        """Kembalikan suara anjing."""
        return "Guk guk"


def main() -> None:
    """Tampilkan hasil inheritance dan overriding method."""
    animals = [Cat("Mimi"), Dog("Bobby")]
    for animal in animals:
        print(f"{animal.name}: {animal.sound()}")


if __name__ == "__main__":
    main()
