import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import read_file, lines

inp = lines(read_file(os.path.join(os.path.dirname(__file__), 'input.txt')))

lists = [
    [int(num) for num in line.split(' ')] for line in inp
]

def test(numbers: list[int]) -> bool:
    decTest = True
    incTest = True

    for i in range(1, len(numbers)):
        curr = numbers[i]
        prev = numbers[i - 1]

        if not prev:
            continue

        diff = curr - prev
        absDiff = abs(diff)
        adjTest = absDiff == 0 or absDiff > 3

        if decTest and (diff > 0 or adjTest):
            decTest = False
        
        if incTest and (diff < 0 or adjTest):
            incTest = False
        
        if not decTest and not incTest:
            return False

    return decTest or incTest

def part_1():
    safe = 0

    for lst in lists:
        if test(lst):
            safe += 1
            continue

    # also works
    # safe = sum(1 for lst in lists if test(lst))

    print('part 1:', safe)



def part_2():
    safe = 0

    for lst in lists:
        if test(lst):
            safe += 1
            continue

        # also works
        # if any(test(lst[:i] + lst[i+1:]) for i in range(len(lst))):
        #     safe += 1

        for i in range(len(lst)):
            new_lst = lst[:i] + lst[i+1:]
            if test(new_lst):
                safe += 1
                break

    print('part 2:', safe)
        

part_1()
part_2()