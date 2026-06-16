type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: LogLevel;
  private prefix: string;

  constructor(prefix: string = '[app]', level: LogLevel = 'info') {
    this.prefix = prefix;
    this.level = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.level];
  }

  private format(level: LogLevel, message: string, ...args: any[]): void {
    if (!this.shouldLog(level)) return;
    // Redact common secret patterns
    const redacted = message
      .replace(/password[=:]\s*\S+/gi, 'password=***')
      .replace(/token[=:]\s*\S+/gi, 'token=***')
      .replace(/secret[=:]\s*\S+/gi, 'secret=***');
    const argsStr = args
      .map((a) => {
        try {
          const s = JSON.stringify(a);
          return s.replace(/"[^"]*(password|token|secret)[^"]*":\s*"[^"]*"/gi, (m) => m.replace(/: "([^"]*)"/, ': "***"'));
        } catch {
          return String(a);
        }
      })
      .join(' ');
    const time = new Date().toISOString();
    // eslint-disable-next-line no-console
    console[level](`${time} ${this.prefix} ${redacted}${argsStr ? ' ' + argsStr : ''}`);
  }

  debug(message: string, ...args: any[]): void {
    this.format('debug', message, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.format('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.format('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.format('error', message, ...args);
  }
}

const logger = new Logger('[BartenderSanctuary]', 'info');

export default logger;
