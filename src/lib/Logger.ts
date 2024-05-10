// 'use server';

import type { Logger } from 'pino';
import pinoLogger from 'pino';

let options = {};

if (typeof window === 'undefined') {
  options = {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        messageKey: 'msg',
      },
    },
  };
} else {
  options = {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        messageKey: 'msg',
      },
    },
  };
}

// const logger = pino(options);

// const originalInfo = logger.info.bind(logger);
// logger.info = (component: unknown | undefined, obj: any) => {
//   const expandedObj = util.inspect(obj, { depth: null, colors: true });
//   originalInfo(`${component}: ${expandedObj}`);
// };

// const originalError = logger.error.bind(logger);
// logger.error = (component: unknown | undefined, obj: any) => {
//   const expandedObj = util.inspect(obj, { depth: null, colors: true });
//   originalError(`${component}: ${expandedObj}`);
// };

// const originalDebug = logger.debug.bind(logger);
// logger.debug = (component: unknown | undefined, obj: any) => {
//   const filename = path.basename(__filename);
//   const expandedObj = util.inspect(obj, { depth: null, colors: true });
//   originalDebug(`${component}: ${filename}: ${expandedObj}`);
// };

let logger: Logger;
export const getLogger = () => {
  if (!logger) {
    const deploymentEnv = process.env.NODE_ENV || 'development';
    logger = pinoLogger({
      level: deploymentEnv === 'production' ? 'info' : 'debug',
      ...options,
    });
  }
  return logger;
};

// export { logger };
