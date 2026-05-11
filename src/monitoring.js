import * as Sentry from "@sentry/react";

export const initMonitoring = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2,
    enabled: import.meta.env.PROD,
  });
};

export { Sentry };
