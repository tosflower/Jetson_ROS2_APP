export var AppOwnership = /*#__PURE__*/ function(AppOwnership) {
    /**
   * The experience is running inside the Expo Go app.
   * @deprecated Use [`Constants.executionEnvironment`](#executionenvironment) instead.
   */ AppOwnership["Expo"] = "expo";
    return AppOwnership;
}({});
/**
 * Identifies where the app's JavaScript bundle is currently running.
 */ export var ExecutionEnvironment = /*#__PURE__*/ function(ExecutionEnvironment) {
    /** A project that includes native project directories that you maintain directly in your
   * [existing React Native project](/bare/overview/).
   */ ExecutionEnvironment["Bare"] = "bare";
    /** Production/release build created with or without EAS Build. */ ExecutionEnvironment["Standalone"] = "standalone";
    /** Expo Go or a development build built with `expo-dev-client`. */ ExecutionEnvironment["StoreClient"] = "storeClient";
    return ExecutionEnvironment;
}({});
// @needsAudit
/**
 * Current supported values are `handset`, `tablet`, `desktop` and `tv`. CarPlay will show up
 * as `unsupported`.
 */ export var UserInterfaceIdiom = /*#__PURE__*/ function(UserInterfaceIdiom) {
    UserInterfaceIdiom["Handset"] = "handset";
    UserInterfaceIdiom["Tablet"] = "tablet";
    UserInterfaceIdiom["Desktop"] = "desktop";
    UserInterfaceIdiom["TV"] = "tv";
    UserInterfaceIdiom["Unsupported"] = "unsupported";
    return UserInterfaceIdiom;
}({});

//# sourceMappingURL=Constants.types.js.map
