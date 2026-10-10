// src/sandboxes.ts
var defaultSandboxes = [
  {
    id: "replit",
    name: "Replit",
    env: [{ name: "REPLIT_SESSION" }, { name: "REPLIT_CONTAINER" }, { name: "REPLIT_USER" }]
  },
  {
    id: "bolt",
    name: "bolt.new",
    env: [{ name: "BOLT_ENV" }, { name: "BOLT_ORIGIN" }, { name: "BOLT_SERVER_URL" }]
  },
  {
    id: "e2b",
    name: "E2B",
    env: [{ name: "E2B_SANDBOX", value: "true" }]
  },
  {
    id: "vercel-sandbox",
    name: "Vercel Sandbox",
    env: [{ name: "HOME", value: "/home/vercel-sandbox" }]
  },
  {
    id: "daytona",
    name: "Daytona",
    env: [{ name: "DAYTONA_SANDBOX_ID" }]
  },
  {
    id: "modal",
    name: "Modal",
    env: [{ name: "MODAL_SANDBOX_ID" }, { name: "MODAL_TASK_ID" }]
  },
  {
    id: "cloudflare-sandbox",
    name: "Cloudflare Sandbox",
    env: [{ name: "CLOUDFLARE_DURABLE_OBJECT_ID" }]
  },
  {
    id: "codespaces",
    name: "GitHub Codespaces",
    env: [{ name: "CODESPACES", value: "true" }]
  },
  {
    id: "codesandbox",
    name: "CodeSandbox",
    env: [{ name: "CSB", value: "true" }, { name: "CSB_SANDBOX_ID" }]
  }
];

// src/index.ts
function detectSandbox(options = {}) {
  const env = options.env ?? process.env;
  const sandboxes = options.sandboxes ?? defaultSandboxes;
  const sandbox = sandboxes.find(
    (candidate) => candidate.env.some((signal) => matchesEnvSignal(signal, env))
  );
  if (sandbox === void 0) return { detected: false };
  return {
    detected: true,
    sandbox: { id: sandbox.id, name: sandbox.name }
  };
}
function isRunningInSandbox(options = {}) {
  return detectSandbox(options).detected;
}
function matchesEnvSignal(signal, env) {
  const value = env[signal.name];
  return value !== void 0 && value !== "" && (signal.value === void 0 || value === signal.value);
}

export {
  defaultSandboxes,
  detectSandbox,
  isRunningInSandbox
};
//# sourceMappingURL=chunk-HZH3SATY.js.map