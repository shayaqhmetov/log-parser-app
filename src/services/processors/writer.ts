import { TransformCallback } from "stream";

import Processor from "../processor";

/**
 * Child class which extends Processor
 * 
 * Format incomming rows to JSON objects
 * 
 * @category Processor
 */
export default class Writer extends Processor {
  
  /** 
   * Process array of string.
   * @param {string[]} data - Chunk data
   * @param {number} count - Chunk iteration count
   * @return {string} formated JSON row
   */
  public process(data: string[], count: number): string {
    let result = data.map(row => {
      const spRow = row.split(" - ");
      const resultedRow = {
        timestamp: spRow[0],
        loglevel: spRow[1],
        ...JSON.parse(spRow[2])
      }
      return JSON.stringify(resultedRow)+",";
    });
    if(count === 1) {
      return `[${result.join("")}`;
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