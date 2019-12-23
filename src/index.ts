import { TCPServer, FileOption } from "./utils/TCPServer";

let server = new TCPServer("0.0.0.0", 8282, {
  outputDirectory: "/",
  outputFileName: "file_copy.jpg"
});

server.startServer();