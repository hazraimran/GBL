const inputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 8;
    const arr = [];
    for (let i = 0; i < len; i++) {
        let val = generatorFn(1, 20);
        arr.push(val);

        if (i % 3 === 0) {
            arr.push(val);
        }
    }
    return arr;
}

const outputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 8;
    const expected: number[] = [];
    for (let i = 0; i < len; i++) {
        let val = generatorFn(1, 20);
        if (i % 3 === 0) {
            expected.push(val);
        }
    }

    return expected;
}

const level = {
    "id": 11,
    "title": "Equalization Room",
    "description": "Get two rocks from the INBOX.If they are EQUAL, put ONE of them in the OUTBOX.Discard non - equal pairs.\nRepeat!",
    "generatorFunction": inputFn.toString(),
    "outputFunction": outputFn.toString(),
    "commands": ["INPUT", "OUTPUT", "JUMP", "COPYFROM", "COPYTO", "ADD", "JUMP = 0", "SUB"],
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
    "expectedExecuteCnt": 40,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": [
        "Sometimes…",
        "…one stone is stronger than another.",
        "And sometimes…",
        "…they’re exactly the same!",
        "Learn to identify and balance them—that’s the essence of great architecture."
    ]

}

