const { traceHook, logTrace, logBoot } = require('./tracer');
const { createHook } = require('./create-hook');
const { registerAction } = require('./register-action');
const hookApp = require('./create-app');
const { getHook } = require('./create-hooks-registry');
const constants = require('./constants');

// Temporary hack to rename "createHook" -> "runHook"
const runHook = (...args) => createHook(...args);
runHook.sync = (...args) => createHook.sync(...args);
runHook.serie = (...args) => createHook.serie(...args);
runHook.parallel = (...args) => createHook.parallel(...args);
runHook.waterfall = (...args) => createHook.waterfall(...args);

module.exports = hookApp;
module.exports.run = hookApp;
module.exports.traceHook = traceHook;
module.exports.logTrace = logTrace;
module.exports.logBoot = logBoot;
module.exports.registerAction = registerAction;
module.exports.createHook = runHook;
module.exports.runHook = runHook;
module.exports.getHook = getHook;

module.exports.CORE = constants.CORE;
module.exports.BOOT = constants.BOOT;
module.exports.SERVICE = constants.SERVICE;
module.exports.FEATURE = constants.FEATURE;
module.exports.SYMBOLS = constants.SYMBOLS;
module.exports.SEPARATOR = constants.SEPARATOR;
module.exports.START = constants.START;
module.exports.SETTINGS = constants.SETTINGS;
module.exports.INIT_SERVICE = constants.INIT_SERVICE;
module.exports.INIT_SERVICES = constants.INIT_SERVICES;
module.exports.INIT_FEATURE = constants.INIT_FEATURE;
module.exports.INIT_FEATURES = constants.INIT_FEATURES;
module.exports.START_SERVICE = constants.START_SERVICE;
module.exports.START_SERVICES = constants.START_SERVICES;
module.exports.START_FEATURE = constants.START_FEATURE;
module.exports.START_FEATURES = constants.START_FEATURES;
module.exports.FINISH = constants.FINISH;
