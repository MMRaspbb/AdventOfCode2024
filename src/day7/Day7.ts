import {readFileSync} from 'fs'

function loadData(solutionArray: number[], equationArray: number[][]): void {
    let data: string[] = readFileSync('./input.txt', 'utf-8').split('\r\n')
    data.forEach((line: string): void => {
        let parsedLine: string[] = line.split(': ')
        solutionArray.push(parseInt(parsedLine[0]))
        equationArray.push(parsedLine[1].split(' ').map((str: string) => parseInt(str)))
    })
}

function left0Fill(str: string, len: number): string {
    let newStr: string = '0'.repeat(len - str.length)
    for (let i = 0; i < str.length; i++) {
        newStr += str[i]
    }
    return newStr
}

function part1(solutionArray: number[], equationArray: number[][]): number {
    let result: number = 0
    let binary: number = 0
    for (let i: number = 0; i < solutionArray.length; i++) {
        binary = 0
        while (binary < Math.pow(2, equationArray[i].length - 1)) {
            let toAdd: number = equationArray[i][0]
            let stringBinary: string = left0Fill(binary.toString(2), equationArray[i].length - 1)
            for(let j: number = 0; j < stringBinary.length; j++){
                if(stringBinary[j] == '0'){
                    toAdd += equationArray[i][j + 1]
                } else{
                    toAdd *= equationArray[i][j + 1]
                }
            }
            if(toAdd == solutionArray[i]){
                result += toAdd
                break
            }
            binary++
        }
    }
    return result
}
function part2(solutionArray: number[], equationArray: number[][]): number{
    let result: number = 0
    let trinary: number = 0
    for (let i: number = 0; i < solutionArray.length; i++) {
        trinary = 0
        while (trinary < Math.pow(3, equationArray[i].length - 1)) {
            let toAdd: number = equationArray[i][0]
            let stringTrinary: string = left0Fill(trinary.toString(3), equationArray[i].length - 1)
            for(let j: number = 0; j < stringTrinary.length; j++){
                if(stringTrinary[j] == '0'){
                    toAdd += equationArray[i][j + 1]
                } else if(stringTrinary[j] == '1'){
                    toAdd *= equationArray[i][j + 1]
                } else{
                    toAdd = parseInt(toAdd.toString() + equationArray[i][j + 1].toString())
                }
            }
            if(toAdd == solutionArray[i]){
                result += toAdd
                break
            }
            trinary++
        }
    }
    return result
}
let solutionArray: number[] = [], equationArray: number[][] = []
loadData(solutionArray, equationArray)
console.log(part1(solutionArray, equationArray))
console.log(part2(solutionArray, equationArray))