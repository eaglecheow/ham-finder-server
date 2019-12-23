"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Net = require("net");
const Fs = require("fs");
const Logger_1 = require("./logger/Logger");
class TCPServer {
    constructor(host, port, fileOption) {
        this.fileData = "";
        this.fileSize = 0;
        this.injectFunctions = (dataFunction, endFunction, closeFunction) => {
            this.server.on("connection", socket => {
                Logger_1.default.info(`[TCPServer] Connection Established => ${socket.remoteAddress}:${socket.remotePort}`);
                socket.on("data", data => dataFunction(data, socket));
                socket.on("end", () => endFunction(socket));
                socket.on("close", () => closeFunction(socket));
            });
        };
        this.onData = (data, socket) => {
            let dataString = data.toString();
            Logger_1.default.silly(`Data String: ${dataString}`);
            if (dataString.includes("ACCIDENT:")) {
                socket.write("GET_IMAGE_SIZE\r\n");
            }
            else if (dataString.includes("IMAGE_SIZE:")) {
                let fileSizeString = dataString.replace("IMAGE_SIZE:", "");
                this.fileSize = Number.parseInt(fileSizeString);
                socket.write("GET_IMAGE\r\n");
            }
            else {
                this.fileData += data;
            }
        };
        this.onEnd = (socket) => {
            Logger_1.default.info("[TCPServer] File transfer completed");
            let decoded = Buffer.from(this.fileData, "base64");
            Logger_1.default.info(`Decoded length: ${decoded.length}`);
            Fs.writeFile(this.fileOption.outputFileName, decoded, err => {
                if (err)
                    throw err;
                else {
                    Logger_1.default.info("[TCPServer] File Saved");
                }
            });
        };
        this.onClose = (socket) => {
            Logger_1.default.info(`Connection closed => ${socket.remoteAddress}:${socket.remotePort}`);
        };
        this.startServer = () => {
            this.injectFunctions(this.onData, this.onEnd, this.onClose);
            this.server.listen(this._port, this._host);
            Logger_1.default.info(`[TCPServer] TCP Server listening at ${this._host}:${this._port}`);
        };
        this._host = host;
        this._port = port;
        this.fileOption = fileOption;
        this.server = Net.createServer();
    }
    get host() {
        return this._host;
    }
    get port() {
        return this._port;
    }
}
exports.TCPServer = TCPServer;
//# sourceMappingURL=TCPServer.js.map