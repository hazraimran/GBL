const inputFn = () => {
    const len = 5;
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() % 10 + 1));
    }
    return arr;
}

const validationFn = (output: number[]) => {
    const len = 5;
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() % 10 + 1));
    }
    
    const expected = arr;
    console.log(expected)
    let isValid = true;
    expected.forEach((val, idx) => {
        if (val !== output[idx]) {
            isValid = false;
        }
    })

    return isValid;
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