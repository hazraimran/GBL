const inputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 6;
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
}

const outputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 6;
    const expected: number[] = [];
    for (let i = 0; i < len; i++) {
        expected.push(generatorFn(1, 20));
    }

    return expected;
}

const level = {
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
}

