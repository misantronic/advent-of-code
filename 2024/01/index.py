import re
import time

def read_file(file_path):
    with open(file_path, 'r') as file:
        return file.readlines()

def lines(file_content):
    return [line.strip() for line in file_content]

input1 = lines(read_file('input-example.txt'))

lists = [
    [int(num) for num in re.findall(r'\d+', line)] for line in input1
]

# also works
# lists = [list(map(int, re.findall(r'\d+', line))) for line in input1]

print(lists)

left = sorted([lst[0] for lst in lists])
right = sorted([lst[1] for lst in lists])

start_time = time.time()
part1_result = sum(abs(right[i] - l) for i, l in enumerate(left))
print('part 1:', part1_result)
print('part 1 time:', time.time() - start_time)

start_time = time.time()
part2_result = sum(l * right.count(l) for l in left)
print('part 2:', part2_result)
print('part 2 time:', time.time() - start_time)