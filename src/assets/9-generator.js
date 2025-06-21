var inputFn = function (generatorFn) {
    var len = 8;
    var arr = [];
    for (var i = 0; i < len; i++) {
        if (i % 2 === 0) {
            arr.push(0);
        }
        else {
            arr.push(generatorFn(1, 20));
        }
    }
    return arr;
};
var outputFn = function (generatorFn) {
    return [0, 0, 0, 0];
};
var level = {
    "id": 9,
    "title": "Zero Preservation",
    "description": "Send only Zeros to the OUTBOX.",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "JUMP", "COPYFROM", "COPYTO", "ADD", "JUMP = 0"],
    "commandsUsed": [],
    "constructionSlots": [{
        "x": 300,
        "y": 300
    },
    {
        "x": 400,
        "y": 300
    },
    {
        "x": 500,
        "y": 300
    }],
    "expectedCommandCnt": 8,
    "expectedExecuteCnt": 25,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": [
        "Recently, someone suggested we pay more attention to the underappreciated materials.",
        "This time, you’ll only keep the “zero-weight” stones.",
        "What about the other materials ? That’s for you to decide!"
    ]
};
