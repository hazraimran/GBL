var inputFn = function () {
    var len = 5;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(Math.random() % 10 + 1);
    }
    return arr;
};
var validationFn = function (output) {
    var len = 5;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(Math.random() % 10 + 1);
    }
    output.map(function (val, idx) {
        if (val !== arr[idx]) {
            return false;
        }
    });
    return true;
};
var level1 = {
    id: 1,
    title: 'Command Post',
    description: 'You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you\'re currently holding.',
    generatorFunction: inputFn.toString(),
    validationFunction: validationFn.toString(),
    commands: ['INPUT', 'OUTPUT'],
    instructionCountAchievement: null,
    commandCountAchievement: null,
    isLocked: false
};
console.log(JSON.stringify(level1));
