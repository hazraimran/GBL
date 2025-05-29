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
        expected.push(generatorFn(1, 20) * 8);
    }
    return expected;
};
var level = {
    "id": 7,
    "title": "Octoplier Suite",
    "description": "For each rock in the INBOX, multiply it by 8, and put the result in the OUTBOX. \n\nUsing a bunch of ADD commands is easy, but WASTEFUL!Can you do it using only 3 ADD commands ?Management is watching.",
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
    "expectedCommandCnt": 10,
    "expectedExecuteCnt": 29,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": ["Astonishing!",
        "You've discovered our most secret multiplication workshop!",
        "Every stone here must be precisely transformed to eight times its original weight.",
        "But resources are scarce—you must complete this task with minimal tools.",
        "Remember, a true master isn't defined by how many tools they possess, but by how cleverly they use them."]
};
console.log(JSON.stringify(level));
