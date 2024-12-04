import os
import sys
from typing import Tuple, List, Union
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import read_file, lines

file = lines(read_file(os.path.join(os.path.dirname(__file__), 'input.txt')))

grid = [
    list(line) for line in lines(file)
]

type Origin = Tuple[int, int, Union[str, None]]

results1: List[Origin] = []
results2: List[Origin] = []

def find_letter(word: str, lI: str, origin: Origin, prevOrigin: List[Origin] = []):
    fullOrigin = prevOrigin + [origin]

    if lI >= len(word):
        # TODO unsauber
        if(word == 'XMAS'):
            results1.append(fullOrigin)
        else:
            results2.append(fullOrigin)
        return

    x, y, d = origin
    coords = [
        (x, y-1, 'n'), 
        (x+1, y, 'e'),
        (x, y+1, 's'), 
        (x-1, y, 'w'), 
        (x-1, y-1, 'nw'), 
        (x+1, y-1, 'ne'),
        (x-1, y+1, 'sw'), 
        (x+1, y+1, 'se')
    ]
    for coord in coords:
        x, y, d2 = coord
        if 0 <= y < len(grid) and 0 <= x < len(grid[y]):
            if(grid[y][x] == word[lI] and (d == None or d2 == d)):
                find_letter(word, lI+1, (x, y, d2), fullOrigin)

def part_1():
    start_time = time.time()
    word = 'XMAS'
    for y in range(len(grid)):
        for x in range(len(grid[y])):
            if(grid[y][x] == word[0]):
                find_letter(word, 1, (x, y, None), [])

    end_time = time.time()

    print(f"part1: {len(results1)}, {round(end_time - start_time, 4)*1000}ms")

def part_2():
    start_time = time.time()
    word = 'MAS'
    for y in range(len(grid)):
        for x in range(len(grid[y])):
            if(grid[y][x] == word[0]):
                find_letter(word, 1, (x, y, None))

    pairs = []

    for i in range(len(results2)):
        x1, y1, d1 = results2[i][1]

        if d1 == 'n' or d1 == 's' or d1 == 'w' or d1 == 'e':
            continue

        for j in range(len(results2)):
            x2, y2, d2 = results2[j][1]

            if d2 == 'n' or d2 == 's' or d2 == 'w' or d2 == 'e':
                continue

            if i != j and x1 == x2 and y1 == y2:
                pairs.append((results2[i], results2[j]))
    
    end_time = time.time()

    print(f"part2: {int(len(pairs)/2)}, {round(end_time - start_time, 4)*1000}ms")

part_1()
part_2()