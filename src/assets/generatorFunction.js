"use strict";
import seedrandom from "seedrandom";
var inputFn = function (seed) {
    var len = 5;
    var arr = [];
    var generator = (0, seedrandom.default)(seed);
    for (var i = 0; i < len; i++) {
        arr.push(generator());
    }
    return arr;
};
var validationFn = function (output, seed) {
    var len = 5;
    var arr = [];
    var generator = (0, seedrandom.default)(seed);
    for (var i = 0; i < len; i++) {
        arr.push(generator());
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
