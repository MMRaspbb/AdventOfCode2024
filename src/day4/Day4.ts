import {readFileSync} from 'fs';

function loadData(inputFileName: string): string[] {
    let data: string[] = readFileSync("./" + inputFileName, 'utf-8').split('\r\n')
    return data
}
function makeVertical(horizontal: string[]): string[] {
    let vertical: string[] = []
    let currentString: string = ""
    for (let i = 0; i < horizontal[0].length; i++) {
        for (let j = 0; j < horizontal.length; j++) {
            currentString += horizontal[j][i]
        }
        vertical.push(currentString)
        currentString = ''
    }
    return vertical
}
function makeDiagonalRight(horizontal: string[]): string[] {
    //The line goes right
    let diagonalRight: string[] = []
    let currentString: string = ""
    for (let row: number = 0; row < horizontal.length; row++) {
        let i: number = row, j: number = 0;
        currentString = ''
        while (i < horizontal.length && j < horizontal[0].length) {
            currentString += horizontal[i][j]
            i++
            j++
        }
        diagonalRight.push(currentString)
        currentString = ''
    }
    for (let column: number = 1; column < horizontal[0].length; column++){
        let i: number = 0, j: number = column;
        currentString = ''
        while(i < horizontal.length && j < horizontal[0].length){
            currentString += horizontal[i][j]
            i++
            j++
        }
        diagonalRight.push(currentString)
        currentString = ''
    }
        return diagonalRight
}
function makeDiagonalLeft(horizontal: string[]): string[] {
    //The line goes left
    let diagonalLeft: string[] = []
    let currentString: string = ""
    for (let row: number = 0; row < horizontal.length; row++) {
        let i: number = row, j: number = horizontal[i].length - 1;
        currentString = ''
        while (i < horizontal.length && j >= 0) {
            currentString += horizontal[i][j]
            i++
            j--
        }
        diagonalLeft.push(currentString)
        currentString = ''
    }
    for (let column: number = horizontal[0].length - 2; column >= 0; column--){
        let i: number = 0, j: number = column;
        currentString = ''
        while(i < horizontal.length && j >= 0){
            currentString += horizontal[i][j]
            i++
            j--
        }
        diagonalLeft.push(currentString)
        currentString = ''
    }
    return diagonalLeft
}
function part1(horizontal: string[]): number {
    let result: number = 0;
    let vertical: string[] = makeVertical(horizontal)
    let diagonalRight: string[] = makeDiagonalRight(horizontal)
    let diagonalLeft: string[] = makeDiagonalLeft(horizontal)
    const countNormal:(str: string[]) => number = (str: string[]): number => {
        const re: RegExp = /XMAS/g
        let result: number = 0
        str.forEach((element: string): number => result+=(element.match(re) ?? []).length)
        return result
    }
    const countBack:(str: string[]) => number = (str: string[]): number => {
        const re: RegExp = /SAMX/g
        let result: number = 0
        str.forEach((element: string): number => result+=(element.match(re) ?? []).length)
        return result
    }
    result += countNormal(horizontal)
    result += countNormal(vertical)
    result += countNormal(diagonalLeft)
    result += countNormal(diagonalRight)
    result += countBack(horizontal)
    result += countBack(vertical)
    result += countBack(diagonalLeft)
    result += countBack(diagonalRight)
    return result
}
function part2(data: string[]): number{
    let result: number = 0;
    for(let i: number = 1;i < data.length - 1; i++){
        for(let j: number = 1; j < data[i].length - 1; j++){
            let rithDiagonal: string = data[i - 1][j - 1] + data[i][j] + data[i + 1][j + 1]
            if(rithDiagonal == "MAS" || rithDiagonal == "SAM"){
                let leftDiagonal: string = data[i + 1][j - 1] + data[i][j] + data[i - 1][j + 1]
                if(leftDiagonal == "MAS" || leftDiagonal == "SAM"){
                    result++
                }
            }
        }
    }
    return result
}
let data: string[] = loadData('input.txt')
console.log(part1(data))
console.log(part2(data))