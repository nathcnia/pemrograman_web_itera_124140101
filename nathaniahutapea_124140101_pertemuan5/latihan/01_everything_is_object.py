"""Contoh bahwa nilai dan fungsi di Python merupakan objek."""


class Student:
    """Objek sederhana untuk menyimpan identitas mahasiswa."""

    def __init__(self, name: str, student_id: str) -> None:
        """Inisialisasi nama dan NIM mahasiswa."""
        self.name = name
        self.student_id = student_id

    def introduce(self) -> str:
        """Kembalikan perkenalan singkat mahasiswa."""
        return f"{self.name} ({self.student_id})"


def main() -> None:
    """Tampilkan tipe beberapa objek Python."""
    number = 42
    greeting = "Halo, Python!"
    values = [number, greeting]
    student = Student("Nathania", "124140101")

    print(f"Tipe integer : {type(number).__name__}")
    print(f"Tipe string  : {type(greeting).__name__}")
    print(f"Tipe list    : {type(values).__name__}")
    print(f"Tipe fungsi  : {type(main).__name__}")
    print(f"Tipe objek   : {type(student).__name__}")
    print(f"Perkenalan   : {student.introduce()}")


if __name__ == "__main__":
    main()
