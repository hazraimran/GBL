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
    var len = 4;
    var expected = [];
    for (var i = 0; i < len; i++) {
        expected.push(generatorFn(1, 20));
    }
    return expected;
};
var level = {
    "id": 8,
    "title": "Zero Exterminator",
    "description": "Send all things that ARE NOT ZERO to the OUTBOX.\n\nYou got a new command!It jumps ONLY if the value you are holding is ZERO.Otherwise it continues to the next line.",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "ADD", "COPYFROM", "COPYTO", "JUMP", "JUMP = 0"],
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
        "Where do you see yourself in 5 years?",
        "Or 10 years?",
        "I have a note here from your other boss that says…",
        "From this point on, YOUR PERFORMANCE WILL BE EVALUATED WITH EXTRA SCRUTINY.",
        "What a treat!"
    ]
};
console.log(JSON.stringify(level));
