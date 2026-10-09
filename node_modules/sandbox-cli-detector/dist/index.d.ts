interface EnvSignal {
    readonly name: string;
    readonly value?: string;
}
interface DetectedSandbox {
    readonly id: string;
    readonly name: string;
}
interface SandboxDefinition extends DetectedSandbox {
    readonly env: readonly EnvSignal[];
}
interface DetectSandboxOptions {
    readonly env?: NodeJS.ProcessEnv;
    readonly sandboxes?: readonly SandboxDefinition[];
}
interface DetectionResult {
    readonly detected: boolean;
    readonly sandbox?: DetectedSandbox;
}

declare const defaultSandboxes: {
    id: string;
    name: string;
    env: ({
        name: string;
        value: string;
    } | {
        name: string;
        value?: undefined;
    })[];
}[];

declare function detectSandbox(options?: DetectSandboxOptions): DetectionResult;
declare function isRunningInSandbox(options?: DetectSandboxOptions): boolean;

export { type DetectSandboxOptions, type DetectedSandbox, type DetectionResult, type EnvSignal, type SandboxDefinition, defaultSandboxes, detectSandbox, isRunningInSandbox };
