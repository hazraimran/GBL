const inputFn = () => {
    const len = 6;
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() * 20));
    }
    return arr;
}

const outputFn = () => {
    const len = 6;
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() % 10 + 1));
    }

    let expected = [];
    for (let i=0; i<3; i++) {
        expected.push(arr[i*2] - arr[i*2+1]);
    }

    return expected;
}

const level1 = {
    // id: 1,
    // title: 'Command Post',
    // description: 'You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you\'re currently holding.',
    generatorFunction: inputFn.toString(),
    // outputFunction: outputFn.toString(),
    // commands: ['INPUT', 'OUTPUT'],
    // commandsUsed: [],
    // constructionSlots: [
    //     {
    //         "x": 300,
    //         "y": 200
    //     },
    //     {
    //         "x": 300,
    //         "y": 300
    //     },
    //     {
    //         "x": 300,
    //         "y": 400
    //     }
    // ],
    // expectedCommandCnt: 8,
    // expectedExecuteCnt: 25,
    // commandCountAchievement: null,
    // executeCountAchievement: null,
    // isLocked: false
}

console.log(JSON.stringify(level1))