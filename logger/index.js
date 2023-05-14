const env = require('../../config/env');

Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"


const log = (message="", before="", logLevel, options = {}) => {
    message = message && message.stack ? message.stack  : message;
    if(typeof message ===  'object') message = JSON.stringify(message, null, 4);
    if(logLevel > env.app.logLevel) console.log(`${before}${message}${Reset}`);
    return message;
};

const fatal = (message, options) => log(message, `${Bright}${FgRed}[Fatal Error] `, 50000, options);
const error = (message, options) => log(message, `${FgRed}[Error] `, 40000, options);
const warn = (message, options) => log(message, `${FgYellow}[Warn] `, 30000, options);
const info = (message, options) => log(message, `${Reset}[Info] `, 20000,options);
const debug = (message, options) => log(message, `${FgWhite}[Debug]`, 10000, options);


module.exports = { fatal, error, warn, info, debug }