"""Fungsi matematika geometri dan konversi temperatur."""

PI = 3.14159


def _validate_nonnegative(value: float, name: str) -> None:
    """Pastikan ukuran geometri tidak negatif.

    Args:
        value: Ukuran yang akan diperiksa.
        name: Nama ukuran untuk pesan kesalahan.

    Returns:
        Tidak mengembalikan nilai jika ukuran valid.

    Raises:
        ValueError: Jika ukuran kurang dari nol.
    """
    if value < 0:
        raise ValueError(f"{name} tidak boleh bernilai negatif.")


def square_area(side: float) -> float:
    """Hitung luas persegi.

    Args:
        side: Panjang sisi persegi.

    Returns:
        Luas persegi.
    """
    _validate_nonnegative(side, "Sisi")
    return side**2


def square_perimeter(side: float) -> float:
    """Hitung keliling persegi.

    Args:
        side: Panjang sisi persegi.

    Returns:
        Keliling persegi.
    """
    _validate_nonnegative(side, "Sisi")
    return 4 * side


def rectangle_area(length: float, width: float) -> float:
    """Hitung luas persegi panjang.

    Args:
        length: Panjang persegi panjang.
        width: Lebar persegi panjang.

    Returns:
        Luas persegi panjang.
    """
    _validate_nonnegative(length, "Panjang")
    _validate_nonnegative(width, "Lebar")
    return length * width


def rectangle_perimeter(length: float, width: float) -> float:
    """Hitung keliling persegi panjang.

    Args:
        length: Panjang persegi panjang.
        width: Lebar persegi panjang.

    Returns:
        Keliling persegi panjang.
    """
    _validate_nonnegative(length, "Panjang")
    _validate_nonnegative(width, "Lebar")
    return 2 * (length + width)


def circle_area(radius: float) -> float:
    """Hitung luas lingkaran menggunakan konstanta PI.

    Args:
        radius: Jari-jari lingkaran.

    Returns:
        Luas lingkaran.
    """
    _validate_nonnegative(radius, "Jari-jari")
    return PI * radius**2


def circle_circumference(radius: float) -> float:
    """Hitung keliling lingkaran menggunakan konstanta PI.

    Args:
        radius: Jari-jari lingkaran.

    Returns:
        Keliling lingkaran.
    """
    _validate_nonnegative(radius, "Jari-jari")
    return 2 * PI * radius


def celsius_to_fahrenheit(celsius: float) -> float:
    """Konversi suhu Celsius ke Fahrenheit.

    Args:
        celsius: Suhu dalam derajat Celsius.

    Returns:
        Suhu dalam derajat Fahrenheit.
    """
    return (celsius * 9 / 5) + 32


def celsius_to_kelvin(celsius: float) -> float:
    """Konversi suhu Celsius ke Kelvin.

    Args:
        celsius: Suhu dalam derajat Celsius.

    Returns:
        Suhu dalam Kelvin.
    """
    return celsius + 273.15
