export function isEphemeralDeployment() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_URL);
}

export function getPersistentStorageError(feature: string) {
  return `${feature} is disabled on this Vercel deployment because it still depends on local server files. Move lead and session storage to a database or VPS hosting to enable it live.`;
}