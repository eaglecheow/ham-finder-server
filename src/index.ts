import { TCPServer, FileOption } from "./utils/TCPServer";

let server = new TCPServer("127.0.0.1", 8282, {
  outputDirectory: "/",
  outputFileName: "file_copy.jpg"
});

server.startServer();