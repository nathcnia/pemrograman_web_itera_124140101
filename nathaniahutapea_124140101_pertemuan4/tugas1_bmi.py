"""Program interaktif untuk menghitung dan mengelompokkan nilai BMI."""


def calculate_bmi(weight_kg: float, height_m: float) -> float:
    """Hitung BMI dari berat kilogram dan tinggi meter.

    Args:
        weight_kg: Berat badan dalam kilogram, harus lebih dari nol.
        height_m: Tinggi badan dalam meter, harus lebih dari nol.

    Returns:
        Nilai BMI sebagai bilangan desimal.

    Raises:
        ValueError: Jika berat atau tinggi tidak lebih dari nol.
    """
    if weight_kg <= 0 or height_m <= 0:
        raise ValueError("Berat dan tinggi harus lebih dari nol.")
    return weight_kg / (height_m * height_m)


def get_bmi_category(bmi: float) -> str:
    """Tentukan kategori berat badan berdasarkan nilai BMI.

    Args:
        bmi: Nilai BMI yang akan dikategorikan.

    Returns:
        Label kategori BMI dalam bahasa Indonesia.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def read_positive_number(prompt: str) -> float:
    """Minta angka positif dari pengguna sampai input valid.

    Args:
        prompt: Pesan yang ditampilkan saat meminta angka.

    Returns:
        Angka positif yang dimasukkan pengguna.
    """
    while True:
        try:
            value = float(input(prompt))
            if value > 0:
                return value
            print("Nilai harus lebih dari nol. Silakan coba lagi.")
        except ValueError:
            print("Input harus berupa angka. Silakan coba lagi.")


def main() -> None:
    """Jalankan input, perhitungan BMI, dan tampilkan hasilnya."""
    print("=== Penghitung BMI ===")
    weight_kg = read_positive_number("Masukkan berat badan (kg): ")
    height_m = read_positive_number("Masukkan tinggi badan (m): ")

    bmi = calculate_bmi(weight_kg, height_m)
    category = get_bmi_category(bmi)

    print("\n--- Hasil Perhitungan ---")
    print(f"Berat badan : {weight_kg:.1f} kg")
    print(f"Tinggi badan: {height_m:.2f} m")
    print(f"Nilai BMI   : {bmi:.2f}")
    print(f"Kategori    : {category}")


if __name__ == "__main__":
    main()
