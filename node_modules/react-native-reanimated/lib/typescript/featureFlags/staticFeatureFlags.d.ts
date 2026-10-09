/**
 * Default static feature flag values. Mirrors `staticFlags.json` (the native
 * source of truth) and is the value source on web, where the native module
 * backing `getStaticFeatureFlag` isn't available.
 *
 * Kept in its own module so it can be read from `JSReanimated` without
 * importing `featureFlags/index`, which would create a require cycle through
 * `ReanimatedModule`.
 */
export declare const DefaultStaticFeatureFlags: {
    readonly RUNTIME_TEST_FLAG: false;
    readonly DISABLE_COMMIT_PAUSING_MECHANISM: false;
    readonly ANDROID_SYNCHRONOUSLY_UPDATE_UI_PROPS: false;
    readonly IOS_SYNCHRONOUSLY_UPDATE_UI_PROPS: false;
    readonly EXPERIMENTAL_CSS_ANIMATIONS_FOR_SVG_COMPONENTS: true;
    readonly IOS_CSS_CORE_ANIMATION: false;
    readonly USE_SYNCHRONIZABLE_FOR_MUTABLES: true;
    readonly USE_COMMIT_HOOK_ONLY_FOR_REACT_COMMITS: true;
    readonly ENABLE_SHARED_ELEMENT_TRANSITIONS: false;
    readonly FORCE_REACT_RENDER_FOR_SETTLED_ANIMATIONS: true;
    readonly USE_ANIMATION_BACKEND: false;
};
export type StaticFeatureFlagsSchema = {
    -readonly [K in keyof typeof DefaultStaticFeatureFlags]: boolean;
};
//# sourceMappingURL=staticFeatureFlags.d.ts.map