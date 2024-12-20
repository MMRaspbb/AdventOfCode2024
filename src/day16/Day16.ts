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

function BFSwithExpensiveTurns(map: string[][], start: [number, number], end: [number, number]): number{
    let distance: number[][] = Array.from({length: map.length}, (): number[] => Array(map[0].length).fill(Infinity));
    let directionsMap: string[][] = Array.from({length: map.length}, (): string[] => Array(map[0].length).fill("."))
    distance[start[0]][start[1]] = 0
    let queue: number[][] = []
    let vectors: number[][] = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    for(let vector of vectors){
        let y: number = start[0] + vector[0]
        let x: number = start[1] + vector[1]
        if(map[y][x] != "#"){
            directionsMap[y][x] = vectorToChar(vector)!!
            distance[y][x] = 1 + turnsDifference(vector, [0, 1]) * 1000
            queue.push([y, x])
        }
    }
    while(queue.length != 0){
        let currentPosition: number[] = queue.shift()!!
        for(let vector of vectors){
            let y: number = currentPosition[0] + vector[0]
            let x: number = currentPosition[1] + vector[1]
            if(map[y][x] != "#" && map[y][x] != "S"){
                if(distance[y][x] > distance[currentPosition[0]][currentPosition[1]] + turnsDifference(charToVector(directionsMap[currentPosition[0]][currentPosition[1]])!!, vector) + 1){
                    if(turningPriority != directionsMap[y][x] || vectorToChar(vector) == turningPriority){
                        directionsMap[y][x] = vectorToChar(vector)!!
                        queue.push([y, x])
                        distance[y][x] = distance[currentPosition[0]][currentPosition[1]] + turnsDifference(charToVector(directionsMap[currentPosition[0]][currentPosition[1]])!!, vector) * 1000 + 1
                    }
                }
            }//triple if finish, could be one but this is more readable
        }
    }
    //debugMapPrint(directionsMap)
    return distance[end[0]][end[1]]
}

function part1FuckedUp(maze: string[][]): number{ //I will execute BFS 4 times with 4 different turns priorities to find the best solution
    let startPosition: [number, number] = findCharPosition(maze, 'S'), endPosition: [number, number] = findCharPosition(maze, 'E')
    return BFSwithExpensiveTurns(maze, startPosition, endPosition)
}


let maze: string[][] = loadData()