var inputFn = function (generatorFn) {
    var len = 6;
    var arr = [];
    for (var i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
};
var outputFn = function (generatorFn) {
    return [5, 2, 0];
};
var level = {
    "id": 3,
    "title": "Replica Slate",
    "description": "Ignore the INBOX for now, and just send the following 3 numbers to the OUTBOX: \n\n520\n\nThe Facilities Management staff has placed some items over there on the carpet for you.If only there were a way you could pick them up...",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "JUMP", "COPYFROM"],
    "commandsUsed": [],
    "constructionSlots": [{
        "x": 300,
        "y": 300,
        "value": 5
    },
    {
        "x": 400,
        "y": 300,
        "value": 2
    },
    {
        "x": 500,
        "y": 300,
        "value": 0
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
        "Oh no!",
        "The rolling log system that transports stones has broken down!",
        "But construction can’t wait.",
        "You’ll have to bypass the system and grab stones directly from the construction slot.",
        "Think fast and adapt, young craftsman—the structure depends on you!"
    ]
};
console.log(JSON.stringify(level));
