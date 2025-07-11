var inputFn = function (generatorFn) {
    var len = 6;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(generatorFn.nextInt(1, 20));
    }
    return arr;
};
var outputFn = function (generatorFn) {
    var len = 6;
    var arr = [];
    for (var j = 0; j < len; j++) {
        arr.push(generatorFn.nextInt(1, 20));
    }
    var expected = [];
    for (var k = 0; k < 3; k++) {
        expected.push(arr[k * 2] - arr[k * 2 + 1]);
    }
    return expected;
};
const level1 = {
    // id: 1,
    // title: 'Command Post',
    // description: 'You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you\'re currently holding.',
    generatorFunction: inputFn.toString(),
    outputFunction: outputFn.toString(),
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

export default level1;
