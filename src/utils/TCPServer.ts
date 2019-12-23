import * as Net from "net";
import * as Fs from "fs";
import Logger from "./logger/Logger";

export interface FileOption {
  outputFileName: string;
  outputDirectory: string;
}

export class TCPServer {
  private server: Net.Server;
  private fileOption: FileOption;

  private fileData: string = "";
  private fileSize: number = 0;

  private dataCounter: number = 0;
  private dataLength: number = 0;

  private _host: string;
  public get host(): string {
    return this._host;
  }

  private _port: number;
  public get port(): number {
    return this._port;
  }

  constructor(host: string, port: number, fileOption: FileOption) {
    this._host = host;
    this._port = port;
    this.fileOption = fileOption;

    this.server = Net.createServer();
  }

  private injectFunctions = (
    dataFunction: (data: Buffer, socket: Net.Socket) => void,
    endFunction: (socket: Net.Socket) => void,
    closeFunction: (socket: Net.Socket) => void
  ) => {
    this.server.on("connection", socket => {
      Logger.info(
        `[TCPServer] Connection Established => ${socket.remoteAddress}:${socket.remotePort}`
      );

      socket.on("data", data => dataFunction(data, socket));
      socket.on("end", () => endFunction(socket));
      socket.on("close", () => closeFunction(socket));
    });
  };

  private onData = (data: Buffer, socket: Net.Socket) => {
    let dataString = data.toString();

    Logger.silly(`Data String: ${dataString}`);

    if (dataString.includes("ACCIDENT:")) {
      // TODO: Perform data parsing

      socket.write("GET_IMAGE_SIZE\r\n");
    } else if (dataString.includes("IMAGE_SIZE:")) {
      let fileSizeString = dataString.replace("IMAGE_SIZE:", "");
      this.fileSize = Number.parseInt(fileSizeString);
      socket.write("GET_IMAGE\r\n");
    } else if (dataString.includes("FILE_END")) {

      Logger.info("[TCPServer] File transfer completed");

      let decoded = Buffer.from(this.fileData, "base64");

      Logger.info(`Decoded length: ${decoded.length}`);
      Logger.info(`Received data length: ${this.dataLength}`);

      Fs.writeFile(this.fileOption.outputFileName, decoded, err => {
        if (err) throw err;
        else {
          Logger.info("[TCPServer] File Saved");
        }
      });

    } else {

      if (dataString.includes("\r")) {
        dataString = dataString.replace("\r", "");
      }

      if (dataString.includes("\n")) {
        dataString = dataString.replace("\n", "");
      }

      this.fileData += dataString;
      this.dataCounter += 1;
      this.dataLength += dataString.length;

      Logger.debug(`Data Length: ${dataString.length} -- Data Counter: ${this.dataCounter}`);
    }
  };

  private onEnd = (socket: Net.Socket) => {
    Logger.info("Transfer end")
  };

  private onClose = (socket: Net.Socket) => {
    Logger.info(
      `Connection closed => ${socket.remoteAddress}:${socket.remotePort}`
    );
  };

  /**
   * startServer
   */
  public startServer = () => {
    this.injectFunctions(this.onData, this.onEnd, this.onClose);

    this.server.listen(this._port, this._host);

    Logger.info(
      `[TCPServer] TCP Server listening at ${this._host}:${this._port}`
    );
  };
}
