"""Contoh penggunaan modul math_operations."""

import math_operations
from math_operations import (
    celsius_to_fahrenheit,
    celsius_to_kelvin,
    circle_area,
    circle_circumference,
    rectangle_area,
    rectangle_perimeter,
)


def main() -> None:
    """Jalankan contoh seluruh operasi geometri dan konversi temperatur."""
    side = 5
    length = 8
    width = 3
    radius = 4
    temperature_c = 25

    print("=== Modul Matematika Python ===")
    print(f"Konstanta PI: {math_operations.PI}")

    print("\nGeometri:")
    print(
        f"Persegi (sisi {side} cm)          : "
        f"luas {math_operations.square_area(side):.2f} cm², "
        f"keliling {math_operations.square_perimeter(side):.2f} cm"
    )
    print(
        f"Persegi panjang ({length} x {width} cm): "
        f"luas {rectangle_area(length, width):.2f} cm², "
        f"keliling {rectangle_perimeter(length, width):.2f} cm"
    )
    print(
        f"Lingkaran (jari-jari {radius} cm)   : "
        f"luas {circle_area(radius):.2f} cm², "
        f"keliling {circle_circumference(radius):.2f} cm"
    )

    print("\nKonversi temperatur:")
    print(
        f"{temperature_c}°C = "
        f"{celsius_to_fahrenheit(temperature_c):.2f}°F"
    )
    print(f"{temperature_c}°C = {celsius_to_kelvin(temperature_c):.2f} K")


if __name__ == "__main__":
    main()
