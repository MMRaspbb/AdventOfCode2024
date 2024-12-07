import {readFileSync} from 'fs';

function loadData(inputFileName: string, directivesList: number[][], pagesList: number[][]): void {
    let data: string[] = readFileSync("./" + inputFileName, 'utf-8').split('\r\n\r\n')
    let directivesString: string[] = data[0].split('\r\n')
    directivesString.forEach((element: string): void => {
        let toPush: string[] = element.split('|')
        directivesList.push([parseInt(toPush[0]), parseInt(toPush[1])])
    })
    data[1].split('\n').forEach((line: string): void => {
        let toPush: number[] = line.split(',').map((str: string): number => (parseInt(str)))
        pagesList.push(toPush)
    })
}

function makeDirectivesMap(directivesList: number[][]): Map<number, number[]> {
    let map: Map<number, number[]> = new Map<number, number[]>()
    directivesList.forEach((pair: number[]): void => {
        if (!map.has(pair[0])) {
            map.set(pair[0], [pair[1]])
        } else {
            map.get(pair[0])?.push(pair[1])
        }
    })
    return map
}

function part1(directivesList: number[][], pages: number[][]): number {
    let result: number = 0
    let directivesMap: Map<number, number[]> = makeDirectivesMap(directivesList)
    pages.forEach((line: number[]): void => {
        let lineCorrect: boolean = true;
        for (let i: number = 0; i < line.length - 1; i++) {
            for (let j: number = i + 1; j < line.length; j++) {
                if (!directivesMap.get(line[i])?.includes(line[j])) {
                    lineCorrect = false;
                    break;
                }
            }
            if (!lineCorrect) {
                break;
            }
        }
        if (lineCorrect) {
            result += line[(line.length - 1) / 2]
        }
    })
    return result
}

function lineIsCorrect(line: number[], map: Map<number, number[]>): boolean {
    for (let i: number = 0; i < line.length - 1; i++) {
        for (let j: number = i + 1; j < line.length; j++) {
            if (!map.get(line[i])?.includes(line[j])) {
                return false
            }
        }
    }
    return true;
}

function part2(directivesList: number[][], pages: number[][]): number {
    let result: number = 0
    let directivesMap: Map<number, number[]> = makeDirectivesMap(directivesList)
    pages.forEach((line: number[]): void => {
        let desiredLength: number = (line.length - 1) / 2;
        if (!lineIsCorrect(line, directivesMap)) {
            for (let i: number = 0; i < line.length; i++) {
                let currentLength: number = 0;
                for (let j: number = 0; j < line.length; j++){
                    if(i == j){
                        continue
                    }
                    if(directivesMap.get(line[i])?.includes(line[j])){
                        currentLength++;
                    }
                }
                if(currentLength == desiredLength){
                    result += line[i]
                    break;
                }
            }
        }
    })
    return result
}

let directivesList: number[][] = [], pages: number[][] = [];
loadData('input.txt', directivesList, pages)
console.log(part1(directivesList, pages))
console.log(part2(directivesList, pages))