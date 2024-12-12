import {readFileSync} from "fs";

function loadData(inputFileName: string): string[]{
    return readFileSync('./' + inputFileName, 'utf-8').split(' ')
}

function fixZeroString(str: string): string{
    if(str[0] != '0'){
        return str
    }
    let i: number = 1
    while(i < str.length && str[i] == '0'){
        i++
    }
    if(i == str.length){
        return '0'
    }
    let newString: string = ''
    for(let j: number = i; j < str.length; j++){
        newString += str[j]
    }
    return newString
}

function recursiveTransform(stone: string, depth: number, lookUpTable: Map<string, number>, maxdepth: number): number {
    if(depth == maxdepth){
        return 1
    }
    const key: string = `${stone}-${depth}`
    if(lookUpTable.has(key)){
        return lookUpTable.get(key)!!
    }
    if(stone == '0'){
        let result: number = recursiveTransform('1', depth + 1, lookUpTable, maxdepth)
        lookUpTable.set(key, result)
        return result
    }
    else if(stone.length % 2 == 0){
        let leftHalf: string = fixZeroString(stone.slice(0, stone.length / 2))
        let rightHalf: string = fixZeroString(stone.slice(stone.length / 2))
        let result: number = recursiveTransform(leftHalf, depth + 1, lookUpTable, maxdepth) + recursiveTransform(rightHalf, depth + 1, lookUpTable, maxdepth)
        lookUpTable.set(key, result)
        return result
    }
    else{
        let result: number = recursiveTransform((parseInt(stone) * 2024).toString(), depth + 1, lookUpTable, maxdepth)
        lookUpTable.set(key, result)
        return result
    }
}

function recursionInit(stones: string[], depth: number): number{
    let result: number = 0
    let lookUpTable: Map<string, number> = new Map<string, number>()
    for(let i: number = 0;i < stones.length;i++){
        result += recursiveTransform(stones[i], 0, lookUpTable, depth)
    }
    return result
}

function part1(stones: string[]): number{
    return recursionInit(stones, 25)
}

function part2(stones: string[]): number{
    return recursionInit(stones, 75)
}

let data: string[] = loadData('input.txt')
console.log(part1(data))
console.log(part2(data))