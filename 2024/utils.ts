import { readFileSync } from 'fs';

export function readFile(file: string) {
    const pwd = process.argv[1];

    return readFileSync(`${pwd.replace(/index\.ts$/, '')}/${file}`, 'utf-8');
}

export function lines(input: string) {
    return input.trim().split('\n');
}

export class PriorityQueue<T> {
    private heap: Array<{ item: T; priority: number }> = [];

    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private getLeftChildIndex(index: number): number {
        return 2 * index + 1;
    }

    private getRightChildIndex(index: number): number {
        return 2 * index + 2;
    }

    private swap(index1: number, index2: number): void {
        [this.heap[index1], this.heap[index2]] = [
            this.heap[index2],
            this.heap[index1]
        ];
    }

    private heapifyUp(): void {
        let index = this.heap.length - 1;
        while (
            index > 0 &&
            this.heap[this.getParentIndex(index)].priority >
                this.heap[index].priority
        ) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }

    private heapifyDown(): void {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (
                this.getRightChildIndex(index) < this.heap.length &&
                this.heap[this.getRightChildIndex(index)].priority <
                    this.heap[smallerChildIndex].priority
            ) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (
                this.heap[index].priority <=
                this.heap[smallerChildIndex].priority
            ) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    public enqueue(item: T, priority: number): void {
        this.heap.push({ item, priority });
        this.heapifyUp();
    }

    public dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        if (this.heap.length === 1) {
            return this.heap.pop()?.item;
        }
        const item = this.heap[0].item;
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown();
        return item;
    }

    public get length() {
        return this.heap.length;
    }

    public peek(): T | undefined {
        return this.heap[0]?.item;
    }

    public isEmpty(): boolean {
        return this.heap.length === 0;
    }
}
