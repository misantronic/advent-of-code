import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import read_file

file1 = read_file(os.path.join(os.path.dirname(__file__), 'input.txt'))
file2 = read_file(os.path.join(os.path.dirname(__file__), 'input.txt'))

inp1 = ''.join(file1)
inp2 = ''.join(file2)

result1 = 0

for i in re.finditer(r'mul\((\d{1,3}),(\d{1,3})\)', inp1):
    result1 += int(i.group(1)) * int(i.group(2))

print('part 1:', result1)

result2 = 0
enabled = True

for i in re.finditer(r'(do\(\))|(don\'t\(\))|mul\((\d{1,3}),(\d{1,3})\)', inp2):
    if i.group(1):
        enabled = True
    elif i.group(2):
        enabled = False
    elif enabled and i.group(3) and i.group(4):
        result2 += int(i.group(3)) * int(i.group(4))

print('part 2:', result2)