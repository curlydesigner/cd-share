[![Build Status](https://travis-ci.org/curlydesigner/cd-shared.svg?branch=master)](https://travis-ci.org/curlydesigner/cd-shared) [![Coverage Status](https://coveralls.io/repos/github/curlydesigner/cd-shared/badge.svg)](https://coveralls.io/github/curlydesigner/cd-shared)
# Curly Designer Shared Library 

This library contains shared modules for Curly Designer projects.
## Installation
```sh
npm install cd-shared --save
```
## Modules
### Logger
This class is responsible for application logging
- Initialization: this code should be somwhere in beginning of your application.
```
Logger.appName = 'application name';
Logger.appVersion = '1.0.0';
Logger.level = Logger.Level.INFO;
```
- Creating logger instance
```
export class MyClass {
    logger = new Logger('MyClass');

    constructor() {
        this.logger.debug('Init');
    }
}
```
- Logging to database
```
...
Logger.onLog.subscribe(this.handleLogMessage.bind(this));
...
handleLogMessage(log: Logger.Log): void {
    // add code that writes to database
}
```
## Test
```sh
npm run test
```