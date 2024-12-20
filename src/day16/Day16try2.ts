import {readFileSync} from "fs";

function debugMapPrint(map: string[][]): void{
    map.forEach((line: string[]): void => {
        line.forEach((char: string): void =>{
            process.stdout.write(char);
        })
        console.log()
    })
}

function loadData(): string[][]{
    return readFileSync("./input.txt", 'utf-8').split("\r\n").map((line: string): string[] => (line.split('')))
}

function findCharPosition(map: string[][], char: string): [number, number]{
    for(let i: number = 0; i < map.length; i++){
        for(let j: number = 0; j < map[i].length; j++){
            if(map[i][j] == char){
                return [i, j]
            }
        }
    }
    return [-1, -1]
}

function charToVector(char: string): number[] | undefined{
    switch (char){
        case ">":
            return [0, 1]
        case "<":
            return [0, -1]
        case "^":
            return [-1, 0]
        case "v":
            return [1, 0]
    }
}

function turnsDifference(vector1: number[], vector2: number[]): number{
    if(vector1[0] == vector2[0] && vector1[1] == vector2[1]){
        return 0
    }
    if(vector1[0] == - vector2[0] && vector1[1] == -vector2[1]){
        return 2
    }
    return 1
}

function vectorToChar(vector: number[]): string | undefined{
    if(vector[0] == 1){
        return "v"
    }
    else if(vector[0] == -1){
        return "^"
    }
    else if(vector[1] == 1){
        return ">"
    }
    else{
        return "<"
    }
}

function djikstraWithDynamicCrossUpdate(maze: string[][], start: [number, number], end: [number, number]): number{
    let distance: number[][] = Array.from({length: maze.length}, (): number[] => Array(maze[0].length).fill(Infinity))
    let directionsMap: string[][] = Array.from({length: maze.length}, (): string[] => Array(maze[0].length).fill("."))
    distance[start[0]][start[1]] = 0
    directionsMap[start[0]][start[1]] = ">"
    let queue: [number, number][] = [start]
    let vectors: number[][] = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    while(queue.length > 0){
        queue.sort((a: [number, number], b: [number, number]): number => distance[a[0]][a[1]] - distance[b[0]][b[1]])
        let currentPosition: [number, number] = queue.shift()!!
        if(currentPosition[0] == end[0] && currentPosition[1] == end[1]){
            currentPosition = queue.shift()
            if(currentPosition == undefined){
                break
            }
        }
        let maxOfNewNodes: number = 0
        for(let vector of vectors){
            if(turnsDifference(charToVector(directionsMap[currentPosition[0]][currentPosition[1]])!!, vector) == 2)continue;
            let y: number = currentPosition[0] + vector[0]
            let x: number = currentPosition[1] + vector[1]
            let newDistance = distance[currentPosition[0]][currentPosition[1]] + turnsDifference(charToVector(directionsMap[currentPosition[0]][currentPosition[1]])!!, vector) * 1000 + 1
            if(maze[y][x] != "#" && maze[y][x] != "S" && distance[y][x] > newDistance){
                directionsMap[y][x] = vectorToChar(vector)!!
                queue.push([y, x])
                distance[y][x] = newDistance
                maxOfNewNodes = Math.max(maxOfNewNodes, newDistance)
            }
        }
        distance[currentPosition[0]][currentPosition[1]] = maxOfNewNodes - 1
    }
    debugMapPrint(directionsMap)
    return distance[end[0]][end[1]]
}

function recursiveMapSearch(maze: string[][],currentPosition: [number, number] ,currentVector: [number, number], vectors: [number, number][], currentValue: number): number{
    let currentChar: string = maze[currentPosition[0]][currentPosition[1]]
    if(currentChar == "#"){
        return Infinity
    }
    if(currentChar == "E"){
        return currentValue
    }
    let minim: number = Infinity
    for(let vector of vectors){
        let turnDifference: number = turnsDifference(vector, currentVector)
        let newPosition: [number, number] = [currentPosition[0] + vector[0], currentPosition[1] + vector[1]]
        if(turnDifference == 0){
            console.log("went into straight line")
            minim = Math.min(minim, recursiveMapSearch(maze, newPosition, currentVector, vectors, currentValue + 1))
        }
        if(turnDifference == 1){
            console.log("went into curve")
            minim = Math.min(minim, recursiveMapSearch(maze, newPosition,vector, vectors ,currentValue + 1001))
        }
    }
    return minim
}

function part1(maze: string[][]): number{
    let start: [number, number] = findCharPosition(maze, "S"), end: [number, number] = findCharPosition(maze, "E")
    let vectors: [number, number][] = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    return djikstraWithDynamicCrossUpdate(maze, start, end)
}

let data: string[][] = loadData()
console.log(part1(data))
