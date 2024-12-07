import os
import sys
from typing import List
import time
import re

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import read_file, lines

lines: List[list[int]] = [
    list(map(int, re.findall(r'\d+', line)))
    for line in lines(read_file(os.path.join(os.path.dirname(__file__), 'input-example.txt')))
]

def calc(operators: List[str]) -> int:
    res = 0
    for line in lines:
        result, inputs = line[0], line[1:]
        stack = [inputs.pop(0)]

        while inputs:
            current = inputs.pop(0)
            new_stack = set()

            for stack_val in stack:
                for op in operators:
                    if op == '+':
                        new_stack.add(stack_val + current)
                    elif op == '*':
                        new_stack.add(stack_val * current)
                    elif op == '||':
                        new_stack.add(int(f"{stack_val}{current}"))
            stack = new_stack

        if result in stack:
            res += result
    return res

start_time = time.time()
print(f"part 1: {calc(['+', '*'])}")
end_time = time.time()

print(f"{round(end_time - start_time, 4)*1000}ms")
start_time = time.time()

print(f"part 2: {calc(['+', '*', '||'])}")
end_time = time.time()
print(f"{round(end_time - start_time, 4)*1000}ms")
