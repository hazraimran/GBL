var inputFn = function () {
    var len = 5;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() % 10 + 1));
    }
    return arr;
};
var validationFn = function (output) {
    var len = 5;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(Math.floor(Math.random() % 10 + 1));
    }
    var expected = arr;
    console.log(expected);
    var isValid = true;
    expected.forEach(function (val, idx) {
        if (val !== output[idx]) {
            isValid = false;
        }
    });
    return isValid;
};
var level1 = {
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
};
console.log(JSON.stringify(level1));
