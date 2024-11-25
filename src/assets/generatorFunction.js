var inputFn = function () {
    var len = 6;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() * 20));
    }
    return arr;
};
var outputFn = function () {
    var len = 6;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() % 10 + 1));
    }
    var expected = [];
    for (var i = 0; i < 3; i++) {
        expected.push(arr[i * 2] - arr[i * 2 + 1]);
    }
    return expected;
};
var level1 = {
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
};
console.log(JSON.stringify(level1));
