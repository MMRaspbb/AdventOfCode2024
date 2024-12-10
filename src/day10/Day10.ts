import {readFileSync} from "fs";

function loadData(inputFileName: string): number[][] {
    return readFileSync('./' + inputFileName, 'utf-8').split('\r\n').map((line: string): number[] => (line.split('').map((str: string): number => (parseInt(str)))))
}

function positionInMapBorder(y: number, x: number, yBorder: number, xBorder: number): boolean {
    return x >= 0 && x < xBorder && y >= 0 && y < yBorder
}

function BFSandCount(mountainMap: number[][], position: number[]): number {
    let result: number = 0
    let queue: number[][] = [position]
    const visited: boolean[][] = Array.from({length: mountainMap.length}, (): boolean[] => Array(mountainMap[0].length).fill(false));
    visited[position[0]][position[1]] = true
    let vectors: number[][] = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    while (queue.length != 0) {
        let currentPosition: number[] = queue.shift() ?? [-2, -2]
        vectors.forEach((vector: number[]): void => {
            let y: number = currentPosition[0] + vector[0]
            let x: number = currentPosition[1] + vector[1]
            if (positionInMapBorder(y, x, mountainMap.length, mountainMap[0].length)) {
                if (mountainMap[y][x] - 1 == mountainMap[currentPosition[0]][currentPosition[1]]) {
                    if (!visited[y][x]) {
                        visited[y][x] = true
                        queue.push([y, x])
                        if (mountainMap[y][x] == 9) {
                            result++
                        }
                    }
                }
            }
        })
    }
    return result;
}

function part1(mountainMap: number[][]): number {
    let result: number = 0
    let zeroPositions: number[][] = []
    for (let i: number = 0; i < mountainMap.length; i++) {
        for (let j: number = 0; j < mountainMap[i].length; j++) {
            if (mountainMap[i][j] == 0) {
                zeroPositions.push([i, j])
            }
        }
    }
    zeroPositions.forEach((position: number[]): void => {
        result += BFSandCount(mountainMap, position)
    })

    return result
}

function BFSandCount2(mountainMap: number[][], position: number[]): number {
    let result: number = 0
    let queue: number[][] = [position]
    let vectors: number[][] = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    while (queue.length != 0) {
        let currentPosition: number[] = queue.shift() ?? [-2, -2]
        vectors.forEach((vector: number[]): void => {
            let y: number = currentPosition[0] + vector[0]
            let x: number = currentPosition[1] + vector[1]
            if (positionInMapBorder(y, x, mountainMap.length, mountainMap[0].length)) {
                if (mountainMap[y][x] - 1 == mountainMap[currentPosition[0]][currentPosition[1]]) {
                    queue.push([y, x])
                    if (mountainMap[y][x] == 9) {
                        result++
                    }

                }
            }
        })
    }
    return result;
}

function part2(mountainMap: number[][]): number {
    let result: number = 0
    let zeroPositions: number[][] = []
    for (let i: number = 0; i < mountainMap.length; i++) {
        for (let j: number = 0; j < mountainMap[i].length; j++) {
            if (mountainMap[i][j] == 0) {
                zeroPositions.push([i, j])
            }
        }
    }
    zeroPositions.forEach((position: number[]): void => {
        result += BFSandCount2(mountainMap, position)
    })
    return result
}

let data: number[][] = loadData('input.txt')
console.log(part1(data))
console.log(part2(data))
