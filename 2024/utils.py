def read_file(file_path: str) -> list[str]:
    with open(file_path, 'r') as file:
        return file.readlines()

def lines(file_content: list[str]) -> list[str]:
    return [line.strip() for line in file_content]