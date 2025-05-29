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
    return expected;
};
var level = {
    "id": 2,
    "title": "Busy Supply Chamber",
    "description": "Grab each rock from the INBOX, and drop each one into the OUTBOX.\n\n You got a new command!You can drag JUMP 's arrow to jump to different lines within your program.\n\n With this new ability, you can complete this assignment using only 3 total commands.",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "JUMP"],
    "commandsUsed": [],
    "constructionSlots": [],
    "expectedCommandCnt": 4,
    "expectedExecuteCnt": 24,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": [
        "Congratulations on your promotion to Apprentice Craftsman!",
        "But don’t get too comfortable—the challenges only get harder from here.",
        "Here is your new assignment."
    ]
};
console.log(JSON.stringify(level));
