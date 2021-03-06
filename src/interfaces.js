// @flow

interface IEventListener {
  on(eventName: string, listener: any): any;
}

export interface IGenerator {
  generate(componentName: string, options?: Object): IEventListener;
  on(eventName: string, listener: any): any;
}

export interface IConfigLoader {
  load(searchPath?: string, configPath?: string): Promise<Object | null>;
}

export interface ILogger {
  info(message: string): void;
  infoAlt(message: string): void;
  error(message: string): void;
  success(message: string): void;
  warn(message: string): void;
  done(message: string): void;
}
