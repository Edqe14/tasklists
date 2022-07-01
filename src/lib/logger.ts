import { BrowserReporter, Consola, ConsolaReporter, LogLevel } from 'consola';

const logger = new Consola({
  level: import.meta.env.DEV ? LogLevel.Verbose : LogLevel.Info,
  reporters: [
    new BrowserReporter()
  ].filter(Boolean) as ConsolaReporter[],
});

export default logger;