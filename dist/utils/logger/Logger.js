"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Winston = require("winston");
const Logger = Winston.createLogger({
    format: Winston.format.combine(Winston.format.timestamp(), Winston.format.printf(({ timestamp, level, message }) => `${timestamp}\t| ${level}\t | ${message}`)),
    transports: [
        new Winston.transports.Console(),
        new Winston.transports.File({ filename: "combined.log" })
    ]
});
exports.default = Logger;
//# sourceMappingURL=Logger.js.map