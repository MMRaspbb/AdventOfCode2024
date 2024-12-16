import { readFileSync } from 'fs';

function debugMapPrint(map: string[][]){
  map.forEach((line: string[]): void  =>{
    line.forEach((char: string): void =>{
      process.stdout.write(char);
    })
    console.log();
  })
}

function parseCharToVector(char: string): [number, number]{
  switch(char){
    case '<':
      return [0, -1];
    case '^':
      return [-1, 0];
    case '>':
      return [0, 1];
    case 'v':
      return [1, 0];
    default:
      return [0, 0];
  }
}

function objectMovePart1(map: string[][], vector: [number, number], objectPosition: [number, number]): boolean{
  let positionPushedByVector: [number, number] = [objectPosition[0] + vector[0], objectPosition[1] + vector[1]]
  let stringNextToPosition = map[positionPushedByVector[0]][positionPushedByVector[1]]
  if(stringNextToPosition == "#"){
    return false
  }
  else if(stringNextToPosition == "O"){
    if(objectMovePart1(map, vector, positionPushedByVector)){
      map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
      map[objectPosition[0]][objectPosition[1]] = "."
      return true
    }
    return false
  }
  else{
    map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
    map[objectPosition[0]][objectPosition[1]] = "."
    return true
  }
}

function calcResult(map: string[][]): number{
  let result: number = 0
  for(let i: number = 1; i < map.length - 1; i++){
    for(let j: number = 1; j < map[i].length - 1; j++){
      if(map[i][j] == "O"){
        result += i * 100 + j
      }
    }
  }
  return result
}

function findRobotPosition(map: string[][]): [number, number]{
  for(let i: number = 0; i < map.length; i++){
    for(let j: number = 0; j < map[i].length; j++){
      if(map[i][j] == "@"){
        return [i,j]
      }
    }
  }
  return [0, 0]
}

function part1(map: string[][], moves: string): number{
  let robotPosition: [number, number] = findRobotPosition(map)
  for(let move of moves){
    let vector: [number, number] = parseCharToVector(move)!!
    let succesfullMove: boolean = objectMovePart1(map, vector, robotPosition);
    if(succesfullMove){
      robotPosition[0] += vector[0]
      robotPosition[1] += vector[1]
    }
  }
  return calcResult(map)
}

function makeWideMap(map: string[][]):string[][] {
  let newMap: string[][] = []
  for(let i: number = 0; i < map.length; i++){
    newMap.push([])
  }
  for(let i: number = 0; i < map.length;i++){
    for(let j: number = 0; j < map[i].length; j++){
      if(map[i][j] == "."){
        newMap[i].push(".")
        newMap[i].push(".")
      }
      else if(map[i][j] == "@"){
        newMap[i].push("@")
        newMap[i].push(".")
      }
      else if(map[i][j] == "O"){
        newMap[i].push("[")
        newMap[i].push("]")
      }
      else{
        newMap[i].push("#")
        newMap[i].push("#")
      }
    }
  }
  return newMap;
}

function objectMovementValidate(map: string[][], vector: [number, number], objectPosition: [number, number]): boolean{
  let positionPushedByVector: [number, number] = [objectPosition[0] + vector[0], objectPosition[1] + vector[1]]
  let stringNextToPosition = map[positionPushedByVector[0]][positionPushedByVector[1]]
  if(stringNextToPosition == "#"){
    return false
  }
  else if(stringNextToPosition == "["){
    if(Math.abs(vector[0]) == 1) {
      if (objectMovementValidate(map, vector, positionPushedByVector) && objectMovementValidate(map, vector, [positionPushedByVector[0], positionPushedByVector[1] + 1])) {
        return true
      }
    }else{
      if(objectMovementValidate(map, vector, positionPushedByVector)){
        return true
      }
    }
    return false

  }
  else if(stringNextToPosition == "]"){
    if(Math.abs(vector[0]) == 1) {
      if (objectMovementValidate(map, vector, positionPushedByVector) && objectMovementValidate(map, vector, [positionPushedByVector[0], positionPushedByVector[1] - 1])) {
        return true
      }
    } else{
      if(objectMovementValidate(map,vector, positionPushedByVector)){
        return true
      }
    }
    return false
  }
  else{
    return true
  }
}

function objectMovePart2(map: string[][], vector: [number, number], objectPosition: [number, number]): void{
  let positionPushedByVector: [number, number] = [objectPosition[0] + vector[0], objectPosition[1] + vector[1]]
  let stringNextToPosition = map[positionPushedByVector[0]][positionPushedByVector[1]]
  if(stringNextToPosition == "["){
    if(Math.abs(vector[0]) == 1) {
      objectMovePart2(map, vector, positionPushedByVector)
      map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
      map[objectPosition[0]][objectPosition[1]] = "."
      objectMovePart2(map, vector, [positionPushedByVector[0], positionPushedByVector[1] + 1])
      map[positionPushedByVector[0]][positionPushedByVector[1] + 1] = ".";
      //map[objectPosition[0]][objectPosition[1] + 1] = "."
    }else{
      objectMovePart2(map, vector, positionPushedByVector)
      map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
      map[objectPosition[0]][objectPosition[1]] = "."
    }
  }
  else if(stringNextToPosition == "]"){
    if(Math.abs(vector[0]) == 1) {
      objectMovePart2(map, vector, positionPushedByVector)
      map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
      map[objectPosition[0]][objectPosition[1]] = "."
      objectMovePart2(map, vector, [positionPushedByVector[0], positionPushedByVector[1] - 1])
      map[positionPushedByVector[0]][positionPushedByVector[1] - 1] = ".";
      //map[objectPosition[0]][objectPosition[1] - 1] = "."
    }else{
      objectMovePart2(map, vector, positionPushedByVector)
      map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
      map[objectPosition[0]][objectPosition[1]] = "."
    }
  }
  else{
    map[positionPushedByVector[0]][positionPushedByVector[1]] = map[objectPosition[0]][objectPosition[1]];
    map[objectPosition[0]][objectPosition[1]] = "."
  }
}

function calcResult2(map: string[][]): number {
  let result: number = 0;
  for(let i: number = 0;i < map.length; i++){
    for(let j: number = 0; j < map[i].length; j++){
      if(map[i][j] == "[")result += i * 100 + j
    }
  }
  return result
}

function part2(map: string[][], moves: string): number{
  map = makeWideMap(map)
  let robotPosition = findRobotPosition(map)
  for(let move of moves){
    let vector: [number, number] = parseCharToVector(move)!!
    if(objectMovementValidate(map, vector, robotPosition)){
      objectMovePart2(map, vector, robotPosition)
      robotPosition[0] += vector[0]
      robotPosition[1] += vector[1]
    }
  }
  return calcResult2(map)
}

let map: string[][], moves: string;
let data: string[] = readFileSync("./input.txt", 'utf-8').split("\r\n\r\n");
map = data[0].split("\r\n").map((line: string) => (line.split("")));
moves = data[1]
console.log(part1(map, moves))
map = data[0].split("\r\n").map((line: string) => (line.split("")));
moves = data[1]
console.log(part2(map, moves))