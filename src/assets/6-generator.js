var inputFn = function (generatorFn) {
    var len = 3;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
};
var outputFn = function (generatorFn) {
    var len = 3;
    var expected = [];
    for (var i = 0; i < len; i++) {
        expected.push(generatorFn(1, 20) * 3);
    }
    return expected;
};
var level = {
    "id": 6,
    "title": "Tripler Room",
    "description": "For each rock in the INBOX, TRIPLE it!",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "JUMP", "COPYFROM", "COPYTO", "ADD"],
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
    }
    ],
    "expectedCommandCnt": 7,
    "expectedExecuteCnt": 20,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": [
        "Who are you ? !",
        "This secret area is reserved for only the most exceptional architects.",
        "And you’re late—seven years late!",
        "From now on, I expect a 100% increase in efficiency.",
        "Every task will be scrutinized with the utmost care.",
        "Good luck!"
    ]
};
console.log(JSON.stringify(level));
