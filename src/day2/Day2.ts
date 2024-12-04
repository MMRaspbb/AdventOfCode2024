import {readFileSync} from 'fs';
function loadData(inputFileName: string, array: number[][]): void{
    const lines:string[] = readFileSync('./' + inputFileName, 'utf-8').split("\n");
    for(const line of lines){
        array.push(line.split(' ').map(str => parseInt(str)));
    }

}
function part1(reports: number[][]): number{
    let n: number = reports[0].length;
    let safeReportsNumber: number = 0;
    let reportSafe:boolean = true;

    for(let i = 0;i < reports.length;i++){
        let modifier: number = -1;
        if(reports[i][0] - reports[i][1] > 0)modifier = 1;
        reportSafe = true;
        for(let j = 0;j < n - 1; j++){
            let toCheck = (reports[i][j] - reports[i][j + 1]) * modifier
            if(toCheck < 1 || toCheck > 3){
                reportSafe = false;
                break;
            }
        }
        if(reportSafe){
            safeReportsNumber++;
        }
    }

    return safeReportsNumber;
}
function simpleChecker(report: number[]): boolean{
    let modifer:number = -1;
    if(report[0] - report[1] > 0) modifer = 1;
    for(let i = 0;i < report.length - 1;i++){
        let toCheck = (report[i] - report[i + 1]) * modifer
        if(toCheck < 1 || toCheck > 3) {
            return false;
        }
    }
    return true;
}
function makeArrayWithoutIndex(array:number[] ,i: number):number[]{
    const newArray = [
        ...array.slice(0, i),
        ...array.slice(i + 1)
    ];
    return newArray;
}
function part2(reports: number[][]): number {
    let safeReportsNumber: number = 0;
    let raportSafe:boolean = true;
    for(let i = 0;i < reports.length;i++){
        raportSafe = true;
        let modifer: number = -1;
        if(reports[i][0] - reports[i][1] > 0) modifer = 1;
        if(!simpleChecker(makeArrayWithoutIndex(reports[i], 0))) {
            for (let j = 0; j < reports[i].length - 1; j++) {
                let toCheck = (reports[i][j] - reports[i][j + 1]) * modifer
                if (toCheck < 1 || toCheck > 3) {
                    if (simpleChecker(makeArrayWithoutIndex(reports[i], j)) || simpleChecker(makeArrayWithoutIndex(reports[i], j + 1))) {
                        break;
                    } else {
                        raportSafe = false;
                        break;
                    }
                }
            }
        }
        if(raportSafe){
            safeReportsNumber++;
        }
    }
    return safeReportsNumber;
}


let reports: number[][] = [];
loadData("input.txt", reports);
console.log("part 1 answer: " + part1(reports));
console.log("part 2 answer: " + part2(reports));

let array: number[] = [1, 2, 3, 4]
array = makeArrayWithoutIndex(array, 3)
console.log(array)