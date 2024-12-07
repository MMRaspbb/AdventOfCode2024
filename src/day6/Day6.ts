import {readFileSync} from 'fs';

function loadData(inputFileName: string): string[][] {
    let unparsedData: string[] = readFileSync("./" + inputFileName, 'utf-8').split("\r\n")
    let parsedData: string[][] = []
    unparsedData.forEach((line: string): void => {
        parsedData.push(line.split(''))
    })
    return parsedData
}

function positionTouchesWall(position: [number, number], xBorder: number, yBorder: number): boolean {
    return position[0] == 0 || position[0] == yBorder - 1 || position[1] == 0 || position[1] == xBorder - 1;

}
function positionOutTheBorder(y: number, x:number, yBorder: number, xBorder: number){
    return x < 0 || x > xBorder - 1 || y < 0 || y > yBorder - 1;

}
function part1(guardMap: string[][]): number {
    fillTheMap(guardMap)
    let result: number = 0
    guardMap.forEach((line: string[]): void => {
        line.forEach((char: string): void => {
            if (char == 'X') result++
        })
    })
    return result
}

function mapCopy(map: string[][]): string[][] {
    let copy: string[][] = []
    map.forEach((line: string[]): void => {
        copy.push([...line])
    })
    return copy
}

function fillTheMap(guardMap: string[][]): void {
    let initialGuardPosition: [number, number] = [0, 0]
    for (let y: number = 0; y < guardMap.length; y++) {
        let x: number = guardMap[y].indexOf('^')
        if (x != -1) {
            initialGuardPosition = [y, x]
            break
        }
    }
    let guardPosition: [number, number] = [initialGuardPosition[0], initialGuardPosition[1]]
    let steps: number[][] = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    let currentStep: number = 0
    guardMap[guardPosition[0]][guardPosition[1]] = 'X'
    do {
        if (guardMap[guardPosition[0] + steps[currentStep][0]][guardPosition[1] + steps[currentStep][1]] != '#') {
            guardPosition[0] += steps[currentStep][0]
            guardPosition[1] += steps[currentStep][1]
            if (guardMap[guardPosition[0]][guardPosition[1]] != 'X') {
                guardMap[guardPosition[0]][guardPosition[1]] = 'X'
            }
        } else {
            currentStep = (currentStep + 1) % steps.length
        }
    } while (!positionTouchesWall(guardPosition, guardMap.length, guardMap[0].length))
}

function checkForLoop(guardMap: string[][], startY: number, startX: number): boolean {
    if(guardMap[startY][startX] == '#'){
        return false
    }
    let currentY: number = startY, currentX: number = startX
    let steps: number[][] = [[-1, 0], [0, 1], [1, 0], [0, -1]]
    let currentStep: number = 0, rotationsInPlace = 0, stepsInTotal = 0
    while(true){
        if(rotationsInPlace == 4)return true
        let nextY = currentY + steps[currentStep][0], nextX = currentX + steps[currentStep][1]
        if(positionOutTheBorder(nextY, nextX, guardMap.length, guardMap[0].length))return false
        if(guardMap[nextY][nextX] == currentStep.toString() || stepsInTotal > guardMap.length * guardMap[0].length){
            return true
        }
        if (guardMap[nextY][nextX] != '#') {
            guardMap[currentY][currentX] = currentStep.toString()
            currentY = nextY
            currentX = nextX
            rotationsInPlace = 0
            stepsInTotal++
        } else {
            currentStep = (currentStep + 1) % steps.length
            rotationsInPlace++
        }
    }
}

function part2(guardMap: string[][]): number {
    let filledMap: string[][] = mapCopy(guardMap)
    let result: number = 0
    let startY: number = 0
    let startX: number = 0
    for (let y: number = 0; y < guardMap.length; y++) {
        let x: number = guardMap[y].indexOf('^')
        if (x != -1) {
            startY = y
            startX = x
            break
        }
    }
    fillTheMap(filledMap)
    for (let y: number = 0; y < filledMap.length; y++) {
        for (let x: number = 0; x < filledMap[y].length; x++) {
            if (filledMap[y][x] == 'X') {
                let toCheck: string[][] = mapCopy(guardMap)
                toCheck[y][x] = '#'
                if (checkForLoop(toCheck, startY, startX)) {
                    result++
                }
            }
        }
    }
    return result
}

let data: string[][] = loadData('input.txt')
console.log(part1(data))
data = loadData('input.txt')
console.log(part2(data))