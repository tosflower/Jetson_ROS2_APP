"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getMockConfig: null,
    getMockContext: null,
    renderRouter: null,
    testRouter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get getMockConfig () {
        return _mockconfig.getMockConfig;
    },
    get getMockContext () {
        return _mockconfig.getMockContext;
    },
    get renderRouter () {
        return renderRouter;
    },
    get testRouter () {
        return testRouter;
    }
});
function _jsxruntime() {
    const data = require("react/jsx-runtime");
    _jsxruntime = function() {
        return data;
    };
    return data;
}
require("./expect");
require("./mocks");
const _ExpoRoot = require("../ExpoRoot");
const _getRouteInfoFromState = require("../global-state/getRouteInfoFromState");
const _navigationRef = require("../global-state/navigationRef");
const _imperativeapi = require("../imperative-api");
const _mockconfig = require("./mock-config");
const rnTestingLibrary = (()=>{
    try {
        return require('@testing-library/react-native');
    } catch (error) {
        if ('code' in error && error.code === 'MODULE_NOT_FOUND') {
            const newError = new Error(`[expo-router/testing-library] "@testing-library/react-native" failed to import. You need to install it to use expo-router's testing library.`);
            newError.stack = error.stack;
            newError.cause = error;
            throw newError;
        }
        throw error;
    }
})();
Object.assign(exports, rnTestingLibrary);
Object.defineProperty(exports, 'screen', {
    get () {
        return rnTestingLibrary.screen;
    }
});
async function renderRouter(context = './app', { initialUrl = '/', linking, ...options } = {}) {
    // See https://github.com/expo/expo/issues/46864 and https://github.com/expo/expo/pull/27648
    const systemTime = Date.now();
    jest.useFakeTimers();
    try {
        jest.setSystemTime(systemTime);
    } catch  {
    // Legacy fake timers don't support `setSystemTime` (and don't mock the clock), so there's nothing to restore.
    }
    const mockContext = (0, _mockconfig.getMockContext)(context);
    // Force the render to be synchronous
    process.env.EXPO_ROUTER_IMPORT_MODE = 'sync';
    const result = await rnTestingLibrary.render(/*#__PURE__*/ (0, _jsxruntime().jsx)(_ExpoRoot.ExpoRoot, {
        context: mockContext,
        location: initialUrl,
        linking: linking
    }), options);
    return Object.assign(result, {
        getPathname () {
            return (0, _getRouteInfoFromState.getRouteInfoFromState)(_navigationRef.navigationRef.getRootState()).pathname;
        },
        getSegments () {
            return (0, _getRouteInfoFromState.getRouteInfoFromState)(_navigationRef.navigationRef.getRootState()).segments;
        },
        getSearchParams () {
            return (0, _getRouteInfoFromState.getRouteInfoFromState)(_navigationRef.navigationRef.getRootState()).params;
        },
        getPathnameWithParams () {
            return (0, _getRouteInfoFromState.getRouteInfoFromState)(_navigationRef.navigationRef.getRootState()).pathnameWithParams;
        },
        getRouterState () {
            return _navigationRef.navigationRef.getRootState();
        }
    });
}
const testRouter = {
    /** Navigate to the provided pathname and assert the pathname */ async navigate (path) {
        await rnTestingLibrary.act(()=>_imperativeapi.router.navigate(path));
        expect(rnTestingLibrary.screen).toHavePathnameWithParams(path);
    },
    /** Push the provided pathname and assert the pathname */ async push (path) {
        await rnTestingLibrary.act(()=>_imperativeapi.router.push(path));
        expect(rnTestingLibrary.screen).toHavePathnameWithParams(path);
    },
    /** Replace with provided pathname and assert the pathname */ async replace (path) {
        await rnTestingLibrary.act(()=>_imperativeapi.router.replace(path));
        expect(rnTestingLibrary.screen).toHavePathnameWithParams(path);
    },
    /** Go back in history and assert the new pathname */ async back (path) {
        expect(_imperativeapi.router.canGoBack()).toBe(true);
        await rnTestingLibrary.act(()=>_imperativeapi.router.back());
        if (path) {
            expect(rnTestingLibrary.screen).toHavePathnameWithParams(path);
        }
    },
    /** If there's history that supports invoking the `back` function. */ canGoBack () {
        return _imperativeapi.router.canGoBack();
    },
    /** Update the current route query params and assert the new pathname */ async setParams (params, path) {
        await rnTestingLibrary.act(()=>_imperativeapi.router.setParams(params));
        if (path) {
            expect(screen).toHavePathnameWithParams(path);
        }
    },
    /** Dismiss every screen in the current stack. */ async dismissAll () {
        await rnTestingLibrary.act(()=>_imperativeapi.router.dismissAll());
    }
};

//# sourceMappingURL=index.js.map
