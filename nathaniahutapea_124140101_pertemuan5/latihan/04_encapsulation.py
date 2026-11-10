"""Contoh encapsulation dengan atribut Celsius privat."""


class Temperature:
    """Kelola suhu Celsius melalui property yang tervalidasi."""

    def __init__(self, celsius: float) -> None:
        """Buat objek suhu menggunakan setter property."""
        self.celsius = celsius

    @property
    def celsius(self) -> float:
        """Kembalikan suhu dari atribut privat."""
        return self.__celsius

    @celsius.setter
    def celsius(self, value: float) -> None:
        """Simpan suhu setelah memeriksa nilai minimum absolut."""
        if value < -273.15:
            raise ValueError("Suhu tidak boleh di bawah nol mutlak.")
        self.__celsius = value

    def to_fahrenheit(self) -> float:
        """Konversi suhu tersimpan ke Fahrenheit."""
        return self.celsius * 9 / 5 + 32


def main() -> None:
    """Demonstrasikan property dan proteksi data suhu."""
    temperature = Temperature(25)
    print(f"Celsius   : {temperature.celsius:.1f}°C")
    print(f"Fahrenheit: {temperature.to_fahrenheit():.1f}°F")


if __name__ == "__main__":
    main()
