import {readFileSync} from "fs";

function reducePatterns(patterns: string[]): Set<string> {
    patterns = patterns.sort((str1: string, str2: string): number => (str1.length - str2.length))
    let necessary: boolean[] = Array(patterns.length).fill(true)
    for (let i: number = patterns.length - 1; i >= 0; i--) {
        necessary[i] = !recursiveDesignCheck(patterns[i], new Set(patterns.slice(0, i)))
    }
    let set: Set<string> = new Set<string>()
    for (let i = 0; i < patterns.length; i++) {
        if (necessary[i]) set.add(patterns[i])
    }
    return set
}

function recursiveDesignCheck(design: string, patterns: Set<string>): boolean {
    if (design.length == 0) {
        return true
    }
    let designSlice: string = ""
    for (let i: number = 0; i < design.length; i++) {
        designSlice += design[i]
        if (patterns.has(designSlice)) {
            if (recursiveDesignCheck(design.slice(i + 1), patterns)) {
                return true
            }
        }
    }
    return false;
}

function part1(patterns: Set<string>, designs: string[]): string[] {
    let possibleDesigns: string[] = []
    for (let design of designs) {
        if (recursiveDesignCheck(design, patterns)) {
            possibleDesigns.push(design)
        }
    }
    return possibleDesigns
}

function recursiveDesignPatternCounter(design: string[], patterns: Set<string>, maxPatternLength: number, counterMap: Map<string, number>): number {
    if (design.length == 0) {
        return 1
    }
    let count: number = 0
    let word: string = ""
    for (let i: number = 0; i < Math.min(maxPatternLength, design.length); i++) {
        word += design[i]
        if (patterns.has(word)) {
            let slicedDesign: string[] = design.slice(i + 1, design.length)
            let combinedDesign: string = slicedDesign.join("")
            if (counterMap.has(combinedDesign)) {
                count += counterMap.get(combinedDesign)!!
            } else {
                let currentCount: number = recursiveDesignPatternCounter(slicedDesign, patterns, maxPatternLength, counterMap)
                counterMap.set(combinedDesign, currentCount)
                count += currentCount
            }
        }
    }
    return count
}

function part2(designs: string[], patterns: Set<string>, reducedPatterns: Set<string>): number {
    let result: number = 0
    let maxPatternLength: number = -Infinity
    for (let pattern of patterns) maxPatternLength = Math.max(pattern.length, maxPatternLength)
    let counterMap: Map<string, number> = new Map<string, number>()
    for (let pattern of reducedPatterns) counterMap.set(pattern, 1)
    for (let i: number = 0; i < designs.length; i++) {
        let toAdd: number = recursiveDesignPatternCounter(designs[i].split(""), patterns, maxPatternLength, counterMap)
        result += toAdd
    }
    console.log(counterMap.size, " rozmiar mapy")
    return result
}

let data: string[] = readFileSync("./input.txt", 'utf-8').split("\r\n\r\n")
let patterns: Set<string> = new Set<string>(data[0].split(", "))
let reducedPatterns: Set<string> = reducePatterns(data[0].split(", "))
let designs: string[] = data[1].split("\r\n")
let possibleDesigns: string[] = part1(reducedPatterns, designs)
console.log("Part 1: ", possibleDesigns.length)
console.log("Part 2: ", part2(possibleDesigns, patterns, reducedPatterns))