// @flow

interface IEventListener {
  on(eventName: string, listener: any): any;
}

export interface IGenerator {
  generate(componentName: string, options?: Object): IEventListener;
}

export interface IConfigLoader {
  load(searchPath?: string, configPath?: string): Promise<Object | null>;
}

export interface ILogger {
  info(message: string): void;
  error(message: string): void;
  success(message: string): void;
}
