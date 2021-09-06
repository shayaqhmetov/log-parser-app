import { TransformCallback } from "stream";

import Processor from "../processor";

interface iWriterOptions {
  splitKey: string;
}
/**
 * Child class which extends Processor
 * 
 * Convert array or object
 * 
 * @category Processor
 */
export default class Writer extends Processor {
  public options: iWriterOptions;
  private dataPassed: number = 0;
  constructor(options: iWriterOptions) {
    super({ objectMode: false });
    this.options = options;
  }
  /** 
   * Process array of string.
   * @param {string[]} data - Chunk data
   * @param {number} count - Chunk iteration count
   * @return {string} formated JSON row
   */
  public process(data: string[], count: number): string {
    if(data.length > 0) {
      this.dataPassed += 1;
    }
    let result = data.map((row: string, i: number) => {
      const spRow = row.split(this.options.splitKey);
      const info = JSON.parse(spRow[2]);
      const timestamp = new Date(spRow[0]).getTime();
      const resultedRow = {
        timestamp,
        loglevel: spRow[1],
        transactionId: info["transactionId"],
        err: info["err"]
      }
      if(this.dataPassed === 1) {
        return JSON.stringify(resultedRow)
      }
      return `,${JSON.stringify(resultedRow)}`;
    });
    if(count === 1) {
      return `[${result}`;
    }
    return result.join("");
  }

  /** 
   * Last called method before finish stream processing
   * 
   * Append array closed symbol
   * @param {TransformCallback} next - calback use to pass data for next processor
   * @return {void}
   */
  public _flush(next: TransformCallback) {
    return next(null, "]");
  }

}