import {readFileSync} from "fs";

function loadData(): number[][][]{
    let pointPattern: RegExp = /p=(\d+),(\d+)/g
    let velocityPattern: RegExp = /v=(\d+|-\d+),(\d+|-\d+)/g
    let data: string = readFileSync("./input.txt", 'utf-8')
    let points: number[][] = []
    let velocities: number[][] = []
    let regPointArray: RegExpStringIterator<RegExpExecArray> = data.matchAll(pointPattern)
    let regVelArray: RegExpStringIterator<RegExpExecArray> = data.matchAll(velocityPattern)
    for(let point of regPointArray){
        points.push([parseInt(point[1]), parseInt(point[2])])
    }
    for(let velocity of regVelArray){
        velocities.push([parseInt(velocity[1]), parseInt(velocity[2])])
    }
    return [points, velocities]
}

function debugMapPrint(points: number[][], xBorder: number, yBorder: number){
    for(let y: number = 0; y < yBorder; y++){
        for(let x: number = 0; x < xBorder; x++){
            let numOfDrones: number = numberOfDronesOnPosition([x, y], points)
            if(numOfDrones != 0){
                process.stdout.write(numOfDrones.toString())
            }
            else{
                process.stdout.write(".")
            }
        }
        console.log()
    }
}

function numberOfDronesOnPosition(position: number[], positions: number[][]): number{
    let result: number = 0
    for(let i: number = 0; i < positions.length; i++){
        if(positions[i][0] == position[0] && positions[i][1] == position[1]){
            result++
        }
    }
    return result
}

function part1(points: number[][], velocities: number[][], xBorder: number, yBorder: number): number{
    let secondsToPass: number = 100
    for(let i: number = 0;i < secondsToPass; i++){
        for(let j: number = 0; j < points.length; j++){
            let newX: number = (points[j][0] + velocities[j][0]) % xBorder
            let newY: number = (points[j][1] + velocities[j][1]) % yBorder
            points[j] = [newX, newY]
        }
    }
    console.log()
    debugMapPrint(points, xBorder, yBorder)
}

let data: number[][][] = loadData()
let points: number[][] = data[0], velocities: number[][] = data[1]
let xBorder: number = 11, yBorder: number = 7
console.log(points)
debugMapPrint(points,xBorder,yBorder)
console.log(part1(points, velocities, xBorder, yBorder))
