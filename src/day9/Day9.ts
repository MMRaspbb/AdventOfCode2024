import {readFileSync} from "fs";

function loadData(inputFileName: string): number[] {
    return readFileSync('./' + inputFileName, 'utf-8').split('').map((str: string): number => (parseInt(str)))
}

function getId(index: number): number {
    if (index % 2 != 0) return -1
    return index / 2
}

function part1(data: number[]): number {
    let result: number = 0, n: number = data.length, multiplier: number = 0
    let leftPointer: number = 0, rightPointer: number = n - 1
    let endFlag: boolean = false
    while (leftPointer <= rightPointer) {
        while (data[leftPointer] != 0) {
            result += multiplier * getId(leftPointer)
            data[leftPointer]--
            multiplier++
        }
        leftPointer++
        if (leftPointer >= rightPointer) {
            break
        }
        while (data[leftPointer] != 0) {
            if (data[rightPointer] == 0) {
                if (rightPointer == leftPointer + 1) {
                    endFlag = true
                    break
                }
                rightPointer -= 2
            }
            result += getId(rightPointer) * multiplier
            data[rightPointer]--
            data[leftPointer]--
            multiplier++
        }
        if (endFlag) break
        leftPointer++
    }

    let debugSum: number = 0

    for (let i: number = leftPointer; i < n; i++) {
        if (getId(i) != -1) {
            while (data[i] != 0) {
                result += multiplier * getId(i)
                debugSum += multiplier * getId(i)
                data[i]--
            }
        }
    }

    return result
}

function makeCounterArray(data: number[]): number[][]{
    let counterArray: number[][] = [], currentPosition: number = 0
    for(let i: number = 0; i < data.length; i++){
        if(getId(i) != -1) {
            counterArray.push([currentPosition, currentPosition + data[i], getId(i)])
        }
        currentPosition += data[i]
    }
    return counterArray
}

function moveArray(array: number[][], fromIndex: number, toIndex: number): void {
    let element: number[] = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, element);
}

function part2(data: number[]): number {
    let counterArray: number[][] = makeCounterArray(data)
    let result: number = 0, n: number = counterArray.length
    let i: number = n - 1, index: number = n - 1
    while(true){
        let distance: number = counterArray[i][1] - counterArray[i][0]
        for(let j: number = 0; j < i; j++){
            if(counterArray[j + 1][0] - counterArray[j][1] >= distance){
                counterArray[i][0] = counterArray[j][1]
                counterArray[i][1] = counterArray[i][0] + distance
                moveArray(counterArray, i, j + 1)
                break
            }
        }
        index -= 1
        if(index == 0){
            break
        }
        i = n - 1
        while(counterArray[i][2] != index){
            i--
        }
    }
    let multiplier: number = 0
    for(let i: number = 0; i < counterArray.length; i++){
        for(let j: number = 0; j < counterArray[i][1] - counterArray[i][0]; j++){
            result += multiplier * counterArray[i][2]
            multiplier++
        }
        if(i != n - 1){
            multiplier += counterArray[i + 1][0] - counterArray[i][1]
        }
    }
    return result
}

let data: number[] = loadData('input.txt')
console.log(part1(data))
data = loadData('input.txt')
console.log(part2(data))