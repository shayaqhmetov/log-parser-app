import fs from "fs";

import Args from "./services/args";
import Rack from "./services/rack";
import { Reader, Writer, Filter } from "./services/processors"

const REQUIRED_ARGS = ["input", "output"];

class Parser {
  private args: Args;
  private rack: Rack;
  constructor() {
    this.args = new Args();
    // Setup rack service with processors
    const reader = new Reader();
    const filter = new Filter({ splitKey: " - ", filterKey: "error"});
    const writer = new Writer({ splitKey: " - " });
    this.rack = new Rack(reader, filter, writer);
  }

  /** 
   * Validate incomming command line arguments
   */
  private _valdate() {
    const keys = this.args.keys();
    REQUIRED_ARGS.forEach(arg => {
      if (!keys.includes(arg)) {
        throw new Error(`You need to pass command line argument "--${arg}"`);
      }
    });
  }

  /** 
   * Get only required arguments from Command line arguments
   * @param  {string[]} - array of required argument keys
   * @return {Record<string, any>} - object conatining only required arguments 
   */
  private filterArgs(required: string[]): Record<string, any> {
    const params = this.args.kwargs();
    const result: Record<string, any> = {};
    required.forEach(arg => {
      result[arg] = params[arg];
    });
    return result;
  }

  public async execute() {
    /* Validate incomming parameters */
    this._valdate();

    /* Prepare data for parsing */
    const path = this.filterArgs(REQUIRED_ARGS);
    const inputFile = fs.createReadStream(path["input"]);
    const outputFile = fs.createWriteStream(path["output"]);
    const promise = this.rack.process(inputFile, outputFile);
    await Promise.all([promise]);
  }
}

const parser = new Parser();
parser.execute();