/**
 * Navigators
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DrawerContent: null,
    DrawerContentScrollView: null,
    DrawerItem: null,
    DrawerItemList: null,
    DrawerProgressContext: null,
    DrawerStatusContext: null,
    DrawerToggleButton: null,
    DrawerView: null,
    createStandardDrawerNavigator: null,
    getDrawerStatusFromState: null,
    useDrawerProgress: null,
    useDrawerStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get DrawerContent () {
        return _DrawerContent.DrawerContent;
    },
    get DrawerContentScrollView () {
        return _DrawerContentScrollView.DrawerContentScrollView;
    },
    get DrawerItem () {
        return _DrawerItem.DrawerItem;
    },
    get DrawerItemList () {
        return _DrawerItemList.DrawerItemList;
    },
    get DrawerProgressContext () {
        return _reactnativedrawerlayout().DrawerProgressContext;
    },
    get DrawerStatusContext () {
        return _DrawerStatusContext.DrawerStatusContext;
    },
    get DrawerToggleButton () {
        return _DrawerToggleButton.DrawerToggleButton;
    },
    get DrawerView () {
        return _DrawerView.DrawerView;
    },
    get createStandardDrawerNavigator () {
        return _createDrawerNavigator.createStandardDrawerNavigator;
    },
    get getDrawerStatusFromState () {
        return _getDrawerStatusFromState.getDrawerStatusFromState;
    },
    get useDrawerProgress () {
        return _reactnativedrawerlayout().useDrawerProgress;
    },
    get useDrawerStatus () {
        return _useDrawerStatus.useDrawerStatus;
    }
});
const _createDrawerNavigator = require("./navigators/createDrawerNavigator");
const _DrawerContent = require("./views/DrawerContent");
const _DrawerContentScrollView = require("./views/DrawerContentScrollView");
const _DrawerItem = require("./views/DrawerItem");
const _DrawerItemList = require("./views/DrawerItemList");
const _DrawerToggleButton = require("./views/DrawerToggleButton");
const _DrawerView = require("./views/DrawerView");
const _DrawerStatusContext = require("./utils/DrawerStatusContext");
const _getDrawerStatusFromState = require("./utils/getDrawerStatusFromState");
const _useDrawerStatus = require("./utils/useDrawerStatus");
function _reactnativedrawerlayout() {
    const data = require("react-native-drawer-layout");
    _reactnativedrawerlayout = function() {
        return data;
    };
    return data;
}

//# sourceMappingURL=index.js.map
