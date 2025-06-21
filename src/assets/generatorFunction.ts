const inputFn = (generatorFn: (min:number, max: number) => number) => {
    const len = 6;
    const arr = [];
    for (let i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }
    return arr;
}

const outputFn = (generatorFn: (min: number, max: number) => number) => {
    const len = 6;
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
        arr.push(generatorFn(1, 20));
    }

    const expected = [];
    for (let i=0; i<3; i++) {
        expected.push(arr[i*2] - arr[i*2+1]);
    }

    return expected;
}

const level1 = {
    generatorFunction: inputFn.toString(),
    outputFunction: outputFn.toString(),
}

export default level1;