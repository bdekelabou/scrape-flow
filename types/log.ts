export const LogLevels = ["info", "error", "warn"] as const;
export type LogLevel = (typeof LogLevels)[number];

export interface Log {
  message: string;
  level: LogLevel;
  timestamp: Date;
}

export type LogFunction = (message: string, level?: LogLevel) => void;
