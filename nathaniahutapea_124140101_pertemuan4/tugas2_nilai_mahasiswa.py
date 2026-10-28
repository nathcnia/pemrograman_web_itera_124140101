"""Menghitung nilai akhir dan grade mahasiswa dari nilai komponen."""


students = [
    {
        "nama": "Alya Putri",
        "nim": "124140101",
        "nilai_uts": 88,
        "nilai_uas": 92,
        "nilai_tugas": 90,
    },
    {
        "nama": "Bagas Pratama",
        "nim": "124140102",
        "nilai_uts": 75,
        "nilai_uas": 80,
        "nilai_tugas": 84,
    },
    {
        "nama": "Citra Lestari",
        "nim": "124140103",
        "nilai_uts": 68,
        "nilai_uas": 72,
        "nilai_tugas": 75,
    },
    {
        "nama": "Dimas Saputra",
        "nim": "124140104",
        "nilai_uts": 55,
        "nilai_uas": 58,
        "nilai_tugas": 62,
    },
    {
        "nama": "Eka Maulana",
        "nim": "124140105",
        "nilai_uts": 42,
        "nilai_uas": 48,
        "nilai_tugas": 50,
    },
]


def calculate_final_score(student: dict[str, int | str]) -> float:
    """Hitung nilai akhir dengan bobot UTS 30%, UAS 40%, tugas 30%.

    Args:
        student: Dictionary data mahasiswa dengan nilai_uts, nilai_uas,
            dan nilai_tugas.

    Returns:
        Nilai akhir mahasiswa dengan dua angka desimal.
    """
    return (
        0.30 * student["nilai_uts"]
        + 0.40 * student["nilai_uas"]
        + 0.30 * student["nilai_tugas"]
    )


def get_grade(final_score: float) -> str:
    """Konversi nilai akhir ke grade huruf A sampai E.

    Args:
        final_score: Nilai akhir mahasiswa pada skala 0 sampai 100.

    Returns:
        Grade huruf sesuai rentang nilai.
    """
    if final_score >= 80:
        return "A"
    elif final_score >= 70:
        return "B"
    elif final_score >= 60:
        return "C"
    elif final_score >= 50:
        return "D"
    else:
        return "E"


def print_student_table(student_records: list[dict[str, int | str]]) -> None:
    """Cetak data mahasiswa, nilai komponen, nilai akhir, dan grade.

    Args:
        student_records: Daftar dictionary mahasiswa yang akan ditampilkan.

    Returns:
        Tidak mengembalikan nilai; hasil ditulis ke terminal.
    """
    headers = ("Nama", "NIM", "UTS", "UAS", "Tugas", "Nilai Akhir", "Grade")
    row_format = "{:<20} {:<12} {:>5} {:>5} {:>7} {:>12} {:>7}"
    print(row_format.format(*headers))
    print("-" * 75)

    for student in student_records:
        final_score = calculate_final_score(student)
        grade = get_grade(final_score)
        print(
            row_format.format(
                student["nama"],
                student["nim"],
                student["nilai_uts"],
                student["nilai_uas"],
                student["nilai_tugas"],
                f"{final_score:.2f}",
                grade,
            )
        )


def print_extreme_students(
    student_records: list[dict[str, int | str]],
) -> None:
    """Tampilkan mahasiswa dengan nilai akhir tertinggi dan terendah.

    Args:
        student_records: Daftar dictionary mahasiswa yang akan diperiksa.

    Returns:
        Tidak mengembalikan nilai; hasil ditulis ke terminal.
    """
    highest_score = max(
        calculate_final_score(item) for item in student_records
    )
    lowest_score = min(
        calculate_final_score(item) for item in student_records
    )
    highest_students = [
        item for item in student_records
        if calculate_final_score(item) == highest_score
    ]
    lowest_students = [
        item for item in student_records
        if calculate_final_score(item) == lowest_score
    ]

    print("\nNilai akhir tertinggi:")
    for student in highest_students:
        print(f"- {student['nama']} ({student['nim']}): {highest_score:.2f}")

    print("Nilai akhir terendah:")
    for student in lowest_students:
        print(f"- {student['nama']} ({student['nim']}): {lowest_score:.2f}")


def main() -> None:
    """Tampilkan tabel nilai beserta mahasiswa dengan nilai ekstrem."""
    print("=== Pengelolaan Nilai Mahasiswa ===")
    print_student_table(students)
    print_extreme_students(students)


if __name__ == "__main__":
    main()
