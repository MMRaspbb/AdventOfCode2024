import {readFileSync} from 'fs';

export class Day1 {
    private static loadData(inputFileName: string, array1: number[], array2: number[]): void {
        const file: string = readFileSync('./day1/' + inputFileName, 'utf-8');

        let lines: string[] = file.split("\n")

        lines.forEach((word: string) => {
            let line: string[] = word.split('   ');
            array1.push(parseInt(line[0]));
            array2.push(parseInt(line[1]));
        })
    }

    public static part1(inputFileName: string): number {
        let firstColumn: number[] = []
        let secondColumn: number[] = []

        this.loadData(inputFileName, firstColumn, secondColumn)

        firstColumn.sort((a: number, b: number): number => a - b)
        secondColumn.sort((a: number, b: number): number => a - b)
        const difference: number = firstColumn.reduce((acc, firstValue, i) => acc + Math.abs(firstValue - secondColumn[i]), 0);
        return difference;
    }

    public static part2(inputFileName: string): number {
        let hashMap: Map<number, number> = new Map<number, number>();
        let firstColumn: number[] = []
        let secondColumn: number[] = []
        this.loadData(inputFileName, firstColumn, secondColumn)

        for (let i: number = 0; i < firstColumn.length; i++) {
            hashMap.set(firstColumn[i], 0)
        }
        for (let i: number = 0; i < secondColumn.length; i++) {
            if (hashMap.has(secondColumn[i])) {
                let previousValue: number = hashMap.get(secondColumn[i]) ?? 0
                hashMap.set(secondColumn[i], previousValue + 1)
            }
        }
        let solution: number = 0
        firstColumn.forEach(function(key:number) {
            solution +=( hashMap.get(key) ?? 0) * key
        })
        return solution
    }
}