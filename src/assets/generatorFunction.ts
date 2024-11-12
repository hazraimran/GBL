const inputFn = () => {
    const len = 5;
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.random() % 10 + 1);
    }
    return arr;
}

const validationFn = (output: number[]) => {
    const len = 5;
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.random() % 10 + 1);
    }

    output.map((val, idx) => {
        if (val !== arr[idx]) {
            return false;
        }
    });
    
    return true;
}
    
const level1 = {
    id: 1,
    title: 'Command Post',
    description: 'You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you\'re currently holding.',
    generatorFunction: inputFn.toString(),
    validationFunction: validationFn.toString(),
    commands: ['INPUT', 'OUTPUT'],
    commandsUsed: [],
    constructionSlots: 3,
    expectedCommandCnt: 8,
    expectedExecuteCnt: 25,
    commandCountAchievement: null,
    executeCountAchievement: null,
    isLocked: false
}

console.log(JSON.stringify(level1))