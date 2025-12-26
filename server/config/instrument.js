// Import with `import * as Sentry from "@sentry/node"` if you are using ESM

import * as Sentry from "@sentry/node"
Sentry.init({
  dsn: "https://0c36d2147c062931c634067553a52664@o4510583076028416.ingest.us.sentry.io/4510583097851904",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});