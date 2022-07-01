import { BrowserReporter, Consola, LogLevel } from 'consola';

const logger = new Consola({
  level: import.meta.env.DEV ? LogLevel.Verbose : LogLevel.Info,
  reporters: [
    new BrowserReporter()
  ],
});

export default logger;