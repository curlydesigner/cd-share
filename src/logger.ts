import { BehaviorSubject } from 'rxjs';
import * as moment from 'moment';

export class Logger {
  static level: Logger.Level;
  static appName: string = '';
  static appVersion: string = '';
  static moduleNames: string[] = [];

  static onLog: BehaviorSubject<Logger.Log> = new BehaviorSubject(null);

  constructor(private name: string) {
    Logger.level = Logger.Level.DEBUG;
  }

  info(...params) {
    this.filterLog(Logger.Level.INFO, params);
  }

  debug(...params) {
    this.filterLog(Logger.Level.DEBUG, params);
  }

  error(...params) {
    this.filterLog(Logger.Level.ERROR, params);
  }

  private filterLog(level, params: any[]) {
    if (level <= Logger.level && (Logger.moduleNames.length === 0 || Logger.moduleNames.indexOf(this.name) !== -1)) {
      this.log(Logger.appName, Logger.appVersion, this.name, level, params);
    }
  }

  log(appName: string, appVersion: string, moduleName: string, level: number, params: any[]) {
    params = params.map(param => {
      try {
        if (param && typeof param === 'object') {
          if (param.message && param.stack) {
            return param.message + ', stack: ' + param.stack;
          } else {
            return JSON.stringify(param);
          }
        } else {
          return param;
        }
      } catch (err) {
        return err;
      }
    });
    const date = new Date();
    const prefixStr = `[${moment(date).format('HH:mm:ss.SSS')} ${appName}.${moduleName}]`;
    var method = level === Logger.Level.ERROR ? console.error : console.log;
    method.apply(console, [prefixStr, ...params]);
    Logger.onLog.next({
      date: date.getTime(),
      level,
      appName,
      appVersion,
      moduleName,
      params,
    });
  }

}

export namespace Logger {
  export enum Level {
    INFO = 2,
    DEBUG = 1,
    ERROR = 0
  };

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