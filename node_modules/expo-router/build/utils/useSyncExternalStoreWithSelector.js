"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useSyncExternalStoreWithSelector", {
    enumerable: true,
    get: function() {
        return useSyncExternalStoreWithSelector;
    }
});
function _react() {
    const data = require("react");
    _react = function() {
        return data;
    };
    return data;
}
function useSyncExternalStoreWithSelector(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
    const instRef = (0, _react().useRef)(null);
    let inst;
    if (instRef.current === null) {
        inst = {
            hasValue: false,
            value: null
        };
        instRef.current = inst;
    } else {
        inst = instRef.current;
    }
    const [getSelection, getServerSelection] = (0, _react().useMemo)(()=>{
        // Track the memoized state using closure variables that are local to this
        // memoized instance of a getSnapshot function. Intentionally not using a
        // useRef hook, because that state would be shared across all concurrent
        // copies of the hook/component.
        let hasMemo = false;
        let memoizedSnapshot;
        let memoizedSelection;
        const memoizedSelector = (nextSnapshot)=>{
            if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                const nextSelection = selector(nextSnapshot);
                if (isEqual !== undefined) {
                    if (inst.hasValue) {
                        const currentSelection = inst.value;
                        if (isEqual(currentSelection, nextSelection)) {
                            memoizedSelection = currentSelection;
                            return currentSelection;
                        }
                    }
                }
                memoizedSelection = nextSelection;
                return nextSelection;
            }
            const prevSnapshot = memoizedSnapshot;
            const prevSelection = memoizedSelection;
            if (Object.is(prevSnapshot, nextSnapshot)) {
                return prevSelection;
            }
            const nextSelection = selector(nextSnapshot);
            if (isEqual !== undefined && isEqual(prevSelection, nextSelection)) {
                memoizedSnapshot = nextSnapshot;
                return prevSelection;
            }
            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;
            return nextSelection;
        };
        const getSnapshotWithSelector = ()=>memoizedSelector(getSnapshot());
        const getServerSnapshotWithSelector = getServerSnapshot == null ? undefined : ()=>memoizedSelector(getServerSnapshot());
        return [
            getSnapshotWithSelector,
            getServerSnapshotWithSelector
        ];
    }, [
        getSnapshot,
        getServerSnapshot,
        selector,
        isEqual
    ]);
    const value = (0, _react().useSyncExternalStore)(subscribe, getSelection, getServerSelection);
    (0, _react().useEffect)(()=>{
        inst.hasValue = true;
        inst.value = value;
    }, [
        value
    ]);
    (0, _react().useDebugValue)(value);
    return value;
}

//# sourceMappingURL=useSyncExternalStoreWithSelector.js.map
