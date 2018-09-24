import 'mocha';
import * as sinon from 'sinon';
import { Logger } from './logger';
import * as moment from 'moment';

describe('logger', () => {
  Logger.appName = 'app name';
  Logger.appVersion = 'app version';

  let logger: Logger;
  beforeEach(() => {
    logger = new Logger('test');
  });

  describe('levels', () => {
    let logStub: sinon.SinonStub;
    beforeEach(() => {
      Logger.level = Logger.Level.INFO;
      logStub = sinon.stub(logger, 'log');
    });
    afterEach(() => {
      Logger.level = Logger.Level.DEBUG;
    });

    it('should log with level info', () => {
      logger.info('message');
      sinon.assert.calledOnce(logStub);
      sinon.assert.calledWith(logStub, 'app name', 'app version', 'test', Logger.Level.INFO, ['message']);
    });
    it('should log with level debug', () => {
      logger.debug('message');
      sinon.assert.calledOnce(logStub);
      sinon.assert.calledWith(logStub, 'app name', 'app version', 'test', Logger.Level.DEBUG, ['message']);
    });
    it('should log with level error', () => {
      logger.error('message');
      sinon.assert.calledOnce(logStub);
      sinon.assert.calledWith(logStub, 'app name', 'app version', 'test', Logger.Level.ERROR, ['message']);
    });
  });

  it('should not log with lever info when global level is debug', () => {
    Logger.level = Logger.Level.DEBUG;
    const logStub = sinon.stub(logger, 'log');
    logger.info('message');
    sinon.assert.notCalled(logStub);
    Logger.level = Logger.Level.DEBUG;
  });
  it('should not log with lever debug when global level is error', () => {
    Logger.level = Logger.Level.ERROR;
    const logStub = sinon.stub(logger, 'log');
    logger.debug('message');
    sinon.assert.notCalled(logStub);
    Logger.level = Logger.Level.DEBUG;
  });
  it('should not log when module is not in modules list', () => {
    Logger.moduleNames = ['test1'];
    const logStub = sinon.stub(logger, 'log');
    logger.debug('message');
    sinon.assert.notCalled(logStub);
    Logger.moduleNames = [];
  });
  it('should log when module is in modules list', () => {
    Logger.moduleNames = ['test'];
    const logStub = sinon.stub(logger, 'log');
    logger.debug('message');
    sinon.assert.calledOnce(logStub);
    Logger.moduleNames = [];
  });
  describe('log', () => {
    let logStub: sinon.SinonStub;
    let errorStub: sinon.SinonStub;
    let nowStub: sinon.SinonStub;
    const now = 1537838479252;
    const nowForatted = moment(now).format('HH:mm:ss.SSS');
    beforeEach(() => {
      nowStub = sinon.stub(Date, 'now');
      nowStub.returns(now);
      logStub = sinon.stub(console, 'log');
      errorStub = sinon.stub(console, 'error');
    });
    afterEach(() => {
      nowStub.restore();
      logStub.restore();
      errorStub.restore();
    });
    it('should log error object', () => {
      logger.log('app name', 'app version', 'test', Logger.Level.ERROR, [{ message: 'error', stack: 'stack' }]);
      sinon.assert.calledOnce(errorStub);
      sinon.assert.calledWith(errorStub, `[${nowForatted} app name.test]`, 'error, stack: stack');
    });
    it('should log object', () => {
      logger.log('app name', 'app version', 'test', Logger.Level.DEBUG, [{ id: '1' }]);
      sinon.assert.calledOnce(logStub);
      sinon.assert.calledWith(logStub, `[${nowForatted} app name.test]`, '{"id":"1"}');
    });
    it('should log string', () => {
      logger.log('app name', 'app version', 'test', Logger.Level.DEBUG, ['string']);
      sinon.assert.calledOnce(logStub);
      sinon.assert.calledWith(logStub, `[${nowForatted} app name.test]`, 'string');
    });
    it('should call log event', () => {
      const nextStub = sinon.stub(Logger.onLog, 'next');
      logger.log('app name', 'app version', 'test', Logger.Level.DEBUG, ['string']);
      sinon.assert.calledOnce(nextStub);
      sinon.assert.calledWith(nextStub, {
        date: now,
        level: Logger.Level.DEBUG,
        appName: 'app name',
        appVersion: 'app version',
        moduleName: 'test',
        params: ['string'],
      });
    });
  });
});
