"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createLimiter: null,
    taskAll: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get createLimiter () {
        return createLimiter;
    },
    get taskAll () {
        return taskAll;
    }
});
const createLimiter = (limit)=>{
    let running = 0;
    let head = null;
    let tail = null;
    const enqueue = ()=>new Promise((resolve)=>{
            const item = {
                resolve,
                next: null
            };
            if (tail) {
                tail.next = item;
                tail = item;
            } else {
                head = item;
                tail = item;
            }
        });
    const dequeue = ()=>{
        if (running < limit && head !== null) {
            const { resolve, next } = head;
            head.next = null;
            head = next;
            if (head === null) {
                tail = null;
            }
            running++;
            resolve();
        }
    };
    return async (fn, ...args)=>{
        if (running < limit) {
            running++;
        } else {
            await enqueue();
        }
        try {
            return await fn(...args);
        } finally{
            running--;
            dequeue();
        }
    };
};
const taskAll = (inputs, map)=>{
    // NOTE: This doesn't depend on CPU cores, but instead is hard-coded depending on
    // number of concurrent IO-bound tasks. `taskAll` can be called concurrently, and
    // we don't keep track of concurrent `taskAll` calls in expo-modules-autolinking.
    // There's a fixed number of concurrent pending IO operations that Node.js handles
    // nicely. It seems that expo-modules-autolinking behaves nicely when this number
    // is around ~8, but this may be higher if disk + core speed is higher.
    const limiter = createLimiter(8);
    return Promise.all(inputs.map((input)=>limiter(map, input)));
};

//# sourceMappingURL=concurrency.js.map
