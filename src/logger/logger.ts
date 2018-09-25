import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

/**
 * This class responsible for allication logging
 */
export class Logger {
  /**
   * Application logger level
   */
  static level: Logger.Level;
  /**
   * Application name, added to logger output
   */
  static appName: string = '';
  /**
   * Application version, added to logger output
   */
  static appVersion: string = '';
  /**
   * Filter modules to log
   */
  static moduleNames: string[] = [];

  /**
   * On log event
   */
  static onLog: BehaviorSubject<Logger.Log> = new BehaviorSubject(null);

  /**
   * Creates logger instance with module name.
   * @param name {string} module name
   */
  constructor(private name: string) {
    Logger.level = Logger.Level.DEBUG;
  }

  /**
   * Outputs logs with info level
   * @param params
   */
  info(...params) {
    this.filterLog(Logger.Level.INFO, params);
  }
  /**
   * Outputs logs with debug level
   * @param params
   */
  debug(...params) {
    this.filterLog(Logger.Level.DEBUG, params);
  }
  /**
   * Outputs logs with error level
   * @param params
   */
  error(...params) {
    this.filterLog(Logger.Level.ERROR, params);
  }

  private filterLog(level, params: any[]) {
    if (level <= Logger.level && (Logger.moduleNames.length === 0 || Logger.moduleNames.indexOf(this.name) !== -1)) {
      this.log(Logger.appName, Logger.appVersion, this.name, level, params);
    }
  }

  /**
   * Outputs logs
   * @param appName {string} application name
   * @param appVersion {string} application version
   * @param moduleName {string} module name
   * @param level {number} log level
   * @param params
   */
  log(appName: string, appVersion: string, moduleName: string, level: number, params: any[]) {
    const normalizedParams = params.map(param => {
      try {
        if (param && typeof param === 'object') {
          if (param.message && param.stack) {
            return `${param.message}, stack: ${param.stack}`;
          } else {
            return JSON.stringify(param);
          }
        } else {
          return param;
        }
      } catch (err) {
        return err.toString();
      }
    });
    const date = Date.now();
    const prefixStr = `[${moment(date).format('HH:mm:ss.SSS')} ${appName}.${moduleName}]`;
    const method = level === Logger.Level.ERROR ? console.error : console.log;
    method.apply(console, [prefixStr, ...normalizedParams]);
    Logger.onLog.next({
      date,
      level,
      appName,
      appVersion,
      moduleName,
      params: normalizedParams,
    });
  }
}

export namespace Logger {
  /**
   * Logging level
   */
  export enum Level {
    INFO = 2,
    DEBUG = 1,
    ERROR = 0,
  }

  /**
   * Log entry model
   */
  export interface Log {
    date: number;
    level: Logger.Level;
    appName: string;
    appVersion: string;
    moduleName: string;
    id?: string;
    params: any[];
  }
}
