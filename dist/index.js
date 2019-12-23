"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TCPServer_1 = require("./utils/TCPServer");
let server = new TCPServer_1.TCPServer("127.0.0.1", 8282, {
    outputDirectory: "/",
    outputFileName: "file_copy.jpg"
});
server.startServer();
//# sourceMappingURL=index.js.map