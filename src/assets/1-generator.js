var inputFn = function (generatorFn) {
    var len = 2;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
};
var outputFn = function (generatorFn) {
    var len = 2;
    var expected = [];
    for (var i = 0; i < len; i++) {
        expected.push(generatorFn(1, 20));
    }
    return expected;
};
var level1 = {
    "id": 1,
    "title": "Supply Chamber",
    "description": "Drag commands into this area to build a program.\n\n Your program should tell your worker to grab each rock from the INBOX, and drop it into the OUTBOX.",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT"],
    "commandsUsed": [],
    "constructionSlots": [],
    "expectedCommandCnt": 4,
    "expectedExecuteCnt": 4,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0,
    "timeAccessed": 0,
    "openningInstruction": [
        "Welcome to the construction site, young apprentice!",
        "Building in these ancient ruins is no small feat!",
        "Your first job will appear over there on the right side in a moment.",
        "Remember, you can always ask me for help."
    ]
};
console.log(JSON.stringify(level1));
