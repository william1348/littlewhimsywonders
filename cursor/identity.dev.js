// Runtime viewer for the local dev server. cursor/identity.ts imports this file.
// Keep it identical to cursor/identity.dev.ts. A published app never reads either file.

export const DEV_VIEWER = {
  sub: "user:dev",
  email: "dev@example.com",
  name: "Dev Viewer",
  teamId: 1,
  teamRole: "admin",
};
