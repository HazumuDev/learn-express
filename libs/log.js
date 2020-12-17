const log4js = require('log4js');
const config = require('config');
log4js.configure(config.log);

const logApp = log4js.getLogger("app");
const logAccess = log4js.getLogger("access");
const logError = log4js.getLogger("error");

exports.access = log4js.connectLogger(log4js.getLogger(access), {
    level: log4js.levels.INFO
});

exports.app = (message) => {
    logApp.info(message);
};

exports.error = (message) => {
    logError.info(message);
};