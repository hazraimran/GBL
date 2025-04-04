var inputFn = function (generatorFn) {
    var len = 6;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
};
var outputFn = function (generatorFn) {
    var len = 6;
    var expected = [];
    for (var i = 0; i < len; i++) {
        expected.push(generatorFn(1, 20));
    }
    for (var i = 0; i < 3; i++) {
        var tmp = expected[i * 2];
        expected[i * 2] = expected[i * 2 + 1];
        expected[i * 2 + 1] = tmp;
    }
    return expected;
};
var level = {
    "id": 4,
    "title": "Scrambler Handler",
    "description": "Grab the first TWO things from the INBOX and drop them into the OUTBOX in the reverse order.Repeat until the INBOX is empty.\n\nYou got a new command!Feel free to COPYTO wherever you like on the carpet.It will be cleaned later.",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "JUMP", "COPYFROM", "COPYTO"],
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
    "expectedCommandCnt": 8,
    "expectedExecuteCnt": 25,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": [
        "Good news!",
        "The rolling log system is fixed, but now the stones are arriving completely out of order!",
        "Your task is to sort them correctly and ensure each one ends up in its proper place.",
        "Precision is key—an unorganized foundation could spell disaster for the entire structure!"
    ]
};
console.log(JSON.stringify(level));
