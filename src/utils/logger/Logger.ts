import * as Winston from "winston";

const Logger = Winston.createLogger({
  format: Winston.format.combine(
    Winston.format.timestamp(),
    Winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} | ${level}\t | ${message}`
    )
  ),
  transports: [
    new Winston.transports.Console({ level: "debug" }),
    new Winston.transports.File({ filename: "combined.log", level: "silly" })
  ]
});

export default Logger;
