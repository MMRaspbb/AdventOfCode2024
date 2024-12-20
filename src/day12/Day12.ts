import {readFileSync} from "fs";

function loadData(inputFileName: string): string[] {
    return readFileSync('./' + inputFileName, 'utf-8').split('\r\n')
}

function positionInMapBorder(y: number, x: number, yBorder: number, xBorder: number): boolean {
    return x >= 0 && x < xBorder && y >= 0 && y < yBorder
}

function calcParamiterTimesArea(visited: boolean[][]): number {
    let vectors: number[][] = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    let parameter: number = 0, area: number = 0
    for (let y: number = 0; y < visited.length; y++) {
        for (let x: number = 0; x < visited[y].length; x++) {
            if (!visited[y][x]) {
                continue
            }
            area++
            for (let vector of vectors) {
                if (positionInMapBorder(y + vector[0], x + vector[1], visited.length, visited[y].length)) {
                    if (!visited[y + vector[0]][x + vector[1]]) {
                        parameter++
                    }
                } else {
                    parameter++
                }
            }
        }
    }
    return parameter * area
}

function combineBoolArrays(a: boolean[][], b: boolean[][]): void {
    let Y: number = a.length, X: number = a[0].length
    for (let i: number = 0; i < Y; i++) {
        for (let j: number = 0; j < X; j++) {
            a[i][j] = a[i][j] || b[i][j]
        }
    }
}

function calcWallsTimesArea(visited: boolean[][]): number {
    const area: number = visited.flat().filter(value => {
        return value;
    }).length;
    let walls: number = 0
    for (let y: number = 0; y < visited.length; y++) {
        let upSeriesAlive: boolean = false
        let downSeriesAlive: boolean = false
        for (let x: number = 0; x < visited[y].length; x++) {
            if (visited[y][x] && (!positionInMapBorder(y - 1, x, visited.length, visited[y].length) || !visited[y - 1][x])) {
                if (!upSeriesAlive) {
                    upSeriesAlive = true
                    walls += 1
                }
            } else {
                upSeriesAlive = false
            }
            if (visited[y][x] && (!positionInMapBorder(y + 1, x, visited.length, visited[y].length) || !visited[y + 1][x])) {
                if (!downSeriesAlive) {
                    downSeriesAlive = true
                    walls += 1
                }
            } else {
                downSeriesAlive = false
            }
        }
    }

    for (let x: number = 0; x < visited[0].length; x++) {
        let leftSeriesAlive: boolean = false
        let rightSeriesAlive: boolean = false
        for (let y: number = 0; y < visited.length; y++) {
            if (visited[y][x] && (!positionInMapBorder(y, x - 1, visited.length, visited[y].length) || !visited[y][x - 1])) {
                if (!leftSeriesAlive) {
                    leftSeriesAlive = true
                    walls += 1
                }
            } else {
                leftSeriesAlive = false
            }
            if (visited[y][x] && (!positionInMapBorder(y, x + 1, visited.length, visited[y].length) || !visited[y][x + 1])) {
                if (!rightSeriesAlive) {
                    rightSeriesAlive = true
                    walls += 1
                }
            } else {
                rightSeriesAlive = false
            }
        }
    }
    return walls * area;
}

function calcPriceOfArea(garden: string[], y: number, x: number, visited: boolean[][], part: number): number {
    let localVisited: boolean[][] = Array.from({length: garden.length}, (): boolean[] => Array(garden[0].length).fill(false));
    localVisited[y][x] = true
    let queue: number[][] = [[y, x]]
    let vectors: number[][] = [[1, 0], [0, 1], [-1, 0], [0, -1]]
    while (queue.length != 0) {
        let currentPosition: number[] = queue.shift()!!
        vectors.forEach((vector: number[]): void => {
            let y: number = currentPosition[0] + vector[0]
            let x: number = currentPosition[1] + vector[1]
            if (positionInMapBorder(y, x, garden.length, garden[0].length)) {
                if (garden[y][x] == garden[currentPosition[0]][currentPosition[1]]) {
                    if (!localVisited[y][x]) {
                        localVisited[y][x] = true
                        queue.push([y, x])
                    }
                }
            }
        })
    }
    combineBoolArrays(visited, localVisited)
    if (part == 1) {
        return calcParamiterTimesArea(localVisited)
    } else {
        return calcWallsTimesArea(localVisited)
    }
}

function part1(garden: string[]): number {
    let result: number = 0
    const visited: boolean[][] = Array.from({length: garden.length}, (): boolean[] => Array(garden[0].length).fill(false));
    for (let y: number = 0; y < garden.length; y++) {
        for (let x: number = 0; x < garden[y].length; x++) {
            if (!visited[y][x]) {
                result += calcPriceOfArea(garden, y, x, visited, 1)
            }
        }
    }
    return result
}

function part2(garden: string[]): number {
    let result: number = 0
    const visited: boolean[][] = Array.from({length: garden.length}, (): boolean[] => Array(garden[0].length).fill(false));
    for (let y: number = 0; y < garden.length; y++) {
        for (let x: number = 0; x < garden[y].length; x++) {
            if (!visited[y][x]) {
                result += calcPriceOfArea(garden, y, x, visited, 2)
            }
        }
    }
    return result
}

let data: string[] = loadData('input.txt')
console.log(part1(data))
console.log(part2(data))