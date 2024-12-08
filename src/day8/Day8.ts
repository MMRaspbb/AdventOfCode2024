import {readFileSync} from 'fs'
function loadData(inputFileName: string): string[]{
    return readFileSync('./' + inputFileName, 'utf-8').split('\r\n')
}
function isSymbolAcceptable(str: string): boolean{
    return ((str >= '0' && str <= '9') || (str >= 'A' && str <= 'Z') || (str >= 'a' && str <= 'z'))
}
function getUniqueSymbols(data: string[]): Map<string, number[][]>{
    let map: Map<string, number[][]> = new Map<string, number[][]>()
    for(let i: number = 0;i < data.length; i++){
        for(let j: number = 0; j < data[i].length; j++){
            if(!isSymbolAcceptable(data[i][j])){
                continue
            }
            if(map.has(data[i][j])){
                map.get(data[i][j])?.push([i,j])
            } else{
                map.set(data[i][j], [[i,j]])
            }
        }
    }

    return map
}
function positionInMapBorder(y: number, x: number, yBorder: number, xBorder: number): boolean{
    return x >= 0 && x < xBorder && y >= 0 && y < yBorder
}
function debugPrint(map: string[][]){
    map.forEach((line) =>{
        line.forEach((char) =>{
            process.stdout.write(char);
        })
        console.log()
    })
}
function part1(satelitesMap: string[]): number{
    let result: number = 0
    let symbolPositions: Map<string, number[][]> = getUniqueSymbols(satelitesMap)

    let fillerMap: string[][] = []
    satelitesMap.forEach((line) =>{
        fillerMap.push(line.split(''))
    })

    let keys: MapIterator<string> = symbolPositions.keys()
    let currentSymbol: string | undefined = keys.next().value
    while(currentSymbol != undefined){
        let currentPositions: number[][] = symbolPositions.get(currentSymbol) ?? []
        for(let i: number = 0;i < currentPositions?.length; i++){
            for(let j: number = 0;j < currentPositions?.length; j++){
                if(j == i)continue
                let y: number = currentPositions[i][0] + (currentPositions[i][0] - currentPositions[j][0])
                let x: number = currentPositions[i][1] + (currentPositions[i][1] - currentPositions[j][1])
                if(positionInMapBorder(y, x, satelitesMap.length, satelitesMap[0].length) && fillerMap[y][x] != '$'){
                    result++
                    fillerMap[y][x] = '$'
                }
            }
        }
        currentSymbol = keys.next().value
    }
    return result;
}
function part2(satelitesMap: string[]): number{
    let result: number = 0
    let symbolPositions: Map<string, number[][]> = getUniqueSymbols(satelitesMap)

    let fillerMap: string[][] = []
    satelitesMap.forEach((line) =>{
        fillerMap.push(line.split(''))
    })

    let keys: MapIterator<string> = symbolPositions.keys()
    let currentSymbol: string | undefined = keys.next().value
    while(currentSymbol != undefined){
        let currentPositions: number[][] = symbolPositions.get(currentSymbol) ?? []
        for(let i: number = 0;i < currentPositions?.length; i++){
            for(let j: number = 0;j < currentPositions?.length; j++){
                if(j == i)continue
                let vectorY: number = currentPositions[i][0] - currentPositions[j][0]
                let vectorX: number = currentPositions[i][1] - currentPositions[j][1]
                let y: number = currentPositions[i][0] + vectorY
                let x: number = currentPositions[i][1] + vectorX
                while(positionInMapBorder(y, x, satelitesMap.length, satelitesMap[0].length)){
                    if(fillerMap[y][x] != '$'){
                        result++
                        fillerMap[y][x] = '$'
                    }
                    y += vectorY
                    x += vectorX
                }
            }
        }
        currentSymbol = keys.next().value
    }
    keys = symbolPositions.keys()
    currentSymbol = keys.next().value
    while(currentSymbol != undefined){
        let currentPositions: number[][] = symbolPositions.get(currentSymbol) ?? []
        for(let i: number = 0;i < currentPositions.length; i++){
            if(fillerMap[currentPositions[i][0]][currentPositions[i][1]] != '$'){
                result++
            }
        }
        currentSymbol = keys.next().value
    }
    return result;
}
let data: string[] = loadData('input.txt')
console.log(part1(data))
console.log(part2(data))