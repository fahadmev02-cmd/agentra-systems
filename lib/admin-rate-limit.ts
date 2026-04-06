type AttemptState = {
  count: number;
  expiresAt: number;
};

const attemptStore = new Map<string, AttemptState>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function getKey(identifier: string) {
  return identifier || "unknown";
}

export function getAdminRateLimit(identifier: string) {
  const key = getKey(identifier);
  const now = Date.now();
  const state = attemptStore.get(key);

  if (!state || state.expiresAt <= now) {
    attemptStore.delete(key);
    return {
      allowed: true,
      remaining: MAX_ATTEMPTS,
      retryAfterSeconds: 0,
    };
  }

  return {
    allowed: state.count < MAX_ATTEMPTS,
    remaining: Math.max(0, MAX_ATTEMPTS - state.count),
    retryAfterSeconds: Math.max(0, Math.ceil((state.expiresAt - now) / 1000)),
  };
}

export function recordAdminFailure(identifier: string) {
  const key = getKey(identifier);
  const now = Date.now();
  const state = attemptStore.get(key);

  if (!state || state.expiresAt <= now) {
    attemptStore.set(key, { count: 1, expiresAt: now + WINDOW_MS });
    return;
  }

  attemptStore.set(key, {
    count: state.count + 1,
    expiresAt: state.expiresAt,
  });
}

export function clearAdminFailures(identifier: string) {
  attemptStore.delete(getKey(identifier));
}