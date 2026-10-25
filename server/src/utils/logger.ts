type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function sanitize(message: unknown): string {
  if (typeof message === 'string') {
    // Redact potential API keys or tokens
    return message.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]');
  }
  if (typeof message === 'object' && message !== null) {
    try {
      const serialized = JSON.stringify(message);
      return serialized.replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]');
    } catch {
      return String(message);
    }
  }
  return String(message);
}

function log(level: LogLevel, message: unknown, ...args: unknown[]) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  const sanitizedMsg = sanitize(message);
  const sanitizedArgs = args.map(sanitize);

  if (level === 'error') {
    console.error(prefix, sanitizedMsg, ...sanitizedArgs);
  } else if (level === 'warn') {
    console.warn(prefix, sanitizedMsg, ...sanitizedArgs);
  } else {
    console.log(prefix, sanitizedMsg, ...sanitizedArgs);
  }
}

export const logger = {
  info: (msg: unknown, ...args: unknown[]) => log('info', msg, ...args),
  warn: (msg: unknown, ...args: unknown[]) => log('warn', msg, ...args),
  error: (msg: unknown, ...args: unknown[]) => log('error', msg, ...args),
  debug: (msg: unknown, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      log('debug', msg, ...args);
    }
  },
};
