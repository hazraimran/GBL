const inputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 8;
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
}

const outputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 4;
    const expected: number[] = [];
    for (let i = 0; i < len; i++) {
        let first = generatorFn(1, 20);
        let second = generatorFn(1, 20);
        expected.push(second - first);
    }

    return expected;
}

const level = {
    "id": 10,
    "title": "Sub Hallway",
    "description": "For each two rocks in the INBOX, first subtract the 1 st from the 2nd and put the result in the OUTBOX.AND THEN, subtract the 2n d from the Ist and put the result in the OUTBOX.Repeat.\n\nYou got a new command!SUBtracts the contents of a tile on the floor FROM whatever value you 're currently holding.",
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
    "expectedExecuteCnt": 25,
    "executeCnt": -1,
    "commandCountAchievement": null,
    "executeCountAchievement": null,
    "isLocked": false,
    "timeSpent": 0, "timeAccessed": 0,
    "openningInstruction": [
        "Subtraction?!",
        "In construction, reducing errors means increasing success.",
        "Did you learn this in school?",
        "Don’t worry—we’re a good team, and I know you can figure it out!"
    ]

}

console.log(JSON.stringify(level))