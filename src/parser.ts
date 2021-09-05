import Args from "./services/args";
import fs from "fs";
import Rack from "./services/rack";
import { Reader, Writer, Filter } from "./services/processors"

const REQUIRED_ARGS = ["input", "output"];

interface iPath {
  input: string;
  output: string;
}

class Parser {
  private args: Args;
  constructor() {
    this.args = new Args();
  }

  private _valdate() {
    const keys = this.args.keys();
    REQUIRED_ARGS.forEach(arg => {
      if (!keys.includes(arg)) {
        throw new Error(`You need to pass command line argument "--${arg}"`);
      }
    });
  }

  private getPath(): iPath {
    const params = this.args.kwargs();
    return {
      input: params["input"],
      output: params["output"]
    }
  }

  public async execute() {
    this._valdate();
    const path = this.getPath();
    const inputFile = fs.createReadStream(path.input);
    const outputFile = fs.createWriteStream(path.output);
    const reader = new Reader();
    const filter = new Filter();
    const writer = new Writer();
    const rack = new Rack(reader, filter, writer);
    const promise = rack.process(inputFile, outputFile);
    await Promise.all([promise]);
  }
}


const logic = new Parser();
logic.execute();