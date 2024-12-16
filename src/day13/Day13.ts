import {readFileSync} from 'fs'

function loadData(inputFileName: string, aButtons: number[][], bButtons: number[][], destinations: number[][]): void{
  let data: string[] = readFileSync('./' + inputFileName, 'utf-8').split('\r\n')
  let j: number = 0
  for(let line of data){
    if(j == 0){
      aButtons.push(line.match(/\d+/g)?.map((str: string): number => (parseInt(str)))!!)
    }
    else if(j == 1){
      bButtons.push(line.match(/\d+/g)?.map((str: string): number => (parseInt(str)))!!)
    }
    else if(j == 2){
      destinations.push(line.match(/\d+/g)?.map((str: string): number => (parseInt(str)))!!)
    }
    j = (j + 1) % 4
  }
}

function simpleHash(x: number, y: number){
  return x * 2003 + y * 2011
}

function bestPathFor(nodes: number[][][], start: number, finish: number): number {
  let nodesCost: number[] = Array(nodes.length).fill(Infinity);
  nodesCost[start] = 0;
  let queue: [number, number][] = [[start, 0]]; // [node, distance]
  let visited: Set<number> = new Set();
  while (queue.length > 0) {
    queue.sort((a, b) => a[1] - b[1]);
    let [currentNode, currentDistance] = queue.shift()!;
    if (visited.has(currentNode)) continue;
    visited.add(currentNode);
    if (currentNode === finish) {
      return currentDistance;
    }
    for (let [neighbor, distance] of nodes[currentNode]) {
      let newDistance = currentDistance + distance;
      if (newDistance < nodesCost[neighbor]) {
        nodesCost[neighbor] = newDistance;
        queue.push([neighbor, newDistance]);
      }
    }
  }
  return Infinity;
}

function makeGraphAndFindBestPath(aPush: number[], bPush: number[], destination: number[]): number{
  let map: Map<number, number> = new Map<number, number>()
  map.set(simpleHash(0, 0), 0)
  let nodes: number[][][] = [[]] //the first array specifies what node are we on, inside we can find the list of it's connections alongside the cost
  let queue: number[][] = [[0,0]]
  let index: number = 1, destinationIndex: number = -1
  while(queue.length != 0){
    let currentNode: number[] = queue.shift()!!
    let currentIndex: number = map.get(simpleHash(currentNode[0], currentNode[1]))!!
    let ax: number = currentNode[0] + aPush[0]
    let ay: number = currentNode[1] + aPush[1]
    let bx: number = currentNode[0] + bPush[0]
    let by: number = currentNode[1] + bPush[1]
    if(ax <= destination[0] && ay <= destination[1]){
      if(map.has(simpleHash(ax, ay))){
        let otherIndex: number = map.get(simpleHash(ax, ay))!!
        nodes[otherIndex].push([currentIndex, 3])
        nodes[currentIndex].push([otherIndex, 3])
      } else{
        nodes.push([])
        map.set(simpleHash(ax, ay), index)
        nodes[index].push([currentIndex, 3])
        nodes[currentIndex].push([index, 3])
        index++
        queue.push([ax, ay])
      }
    }
    if(bx <= destination[0] && by <= destination[1]){
      if(map.has(simpleHash(bx, by))){
        let otherIndex: number = map.get(simpleHash(bx, by))!!
        nodes[otherIndex].push([currentIndex, 1])
        nodes[currentIndex].push([otherIndex, 1])
      } else{
        nodes.push([])
        map.set(simpleHash(bx, by), index)
        nodes[index].push([currentIndex, 1])
        nodes[currentIndex].push([index, 1])
        index++
        queue.push([bx, by])
      }
    }
    if(ax == destination[0] && ay == destination[1]){
      destinationIndex = map.get(simpleHash(ax, ay))!!
    }
    if(bx == destination[0] && by == destination[1]){
      destinationIndex = map.get(simpleHash(bx, by))!!
    }
  }
  if(destinationIndex == -1){
    return 0
  }
  return bestPathFor(nodes, 0, destinationIndex)
}

function part1(aButtons: number[][], bButtons: number[][], destinations: number[][]): number{
  let result: number = 0
  for(let i: number = 0; i < aButtons.length; i++){
    result += makeGraphAndFindBestPath(aButtons[i], bButtons[i], destinations[i])
  }
  return result
}

function calculateAParameter(X: number, bParamiter: number, b: number, a: number){
  return (X - bParamiter * b) / a
}

function part2(aButtons: number[][], bButtons: number[][], destinations: number[][]): number {
  let bParamiter: number = 1
  let aParamiter: number = calculateAParameter(destinations[0][0] + 10000000000000, bParamiter, bButtons[0][0], aButtons[0][0])
  while(aParamiter > 0){
    //console.log(aParamiter + ' ' + bParamiter)
    if(aParamiter % 1 == 0 && aParamiter * aButtons[0][1] + bParamiter * bButtons[0][1] == destinations[0][1] + 10000000000000){
      console.log(aParamiter + ' ' + aButtons[0][0] + ' ' + bParamiter + ' ' + bButtons[0][0])
      break
    }
    bParamiter++
    aParamiter = calculateAParameter(destinations[0][0] + 10000000000000, bParamiter, bButtons[0][0], aButtons[0][0])
  }
}

let aButtons: number[][] = [], bButtons: number[][] = [], desinations: number[][] = []
loadData('input.txt', aButtons, bButtons, desinations)
//console.log(part1(aButtons, bButtons, desinations))
console.log(part2(aButtons, bButtons, desinations))