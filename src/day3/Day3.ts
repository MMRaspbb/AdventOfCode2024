import {readFileSync} from 'fs';

function loadData(inputFileName: string): string {
    let output: string = readFileSync("./" + inputFileName, 'utf-8');
    return output;
}
function part1(data: string): number {
    const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g
    let correctSequences: number[][] = [...data.matchAll(pattern)].map(([, int1, int2]: RegExpExecArray): number[] => [parseInt(int1), parseInt(int2)])
    let result: number = 0;
    correctSequences.forEach((sequence:number[]): void=> result += sequence[0]*sequence[1])
    return result;
}
function part2(data: string): number{
    const findingPattern = /mul\((\d{1,3}),(\d{1,3})\)|(don't\(\))|(do\(\))/g
    const parsingPattern = /(\d{1,3})/g
    let sequences: string[] = data.match(findingPattern)
    let canAdd: boolean = true
    let result: number = 0;
    sequences.forEach((sequence:string):void =>{
        if(sequence[0] == 'm' && canAdd){
            const match: RegExpExecArray = sequence.match(parsingPattern)
            result += parseInt(match[0]) * parseInt(match[1])
        }
        else if(sequence == 'don\'t()'){
            canAdd = false;
        }
        else if(sequence == 'do()'){
            canAdd = true
        }
    })
    return result
}
let data: string = loadData('input.txt')
console.log(part1(data))
console.log(part2(data))