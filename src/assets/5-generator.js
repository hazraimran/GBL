var inputFn = function (generatorFn) {
    var len = 6;
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
        expected.push(generatorFn(1, 20) + generatorFn(1, 20));
    }
    return expected;
};
var level = {
    "id": 5,
    "title": "Replica Slate",
    "description": "For each two things in the INBOX, add them together, and put the result in the OUTBOX.\n\nYou got a new command!It ADDs the contents of a tile on the floor to whatever value you 're currently holding.",
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
        "Sigh…",
        "The rainy season is here, and the site is a muddy mess.",
        "The old architect always said, “Stay calm and focused, and not even the rain can stop a great building.",
        "Don’t worry; math isn’t the key here—just take it one step at a time."
    ]
};
console.log(JSON.stringify(level));
