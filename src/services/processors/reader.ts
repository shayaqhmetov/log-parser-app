import { TransformCallback } from "stream";

import Processor from "../processor";

/**
 * Child class which extends Processor
 * 
 * Parse incomming chunk (Buffer Array) into array of file rows
 * 
 * @category Processor
 */
export default class Reader extends Processor {
  private lastRow: string[];
  private rows: string[];

  constructor() {
    super();
    this.lastRow = [];
    this.rows = [];
  }

  /** 
   * Convert array of splited chunks into array of file rows.
   * @param {string[]} data - array of splited chunks
   * @return {string[]} array of file rows
   */
  private _setLastRow(data: string[]): string[] {
    // iterate each part of splited chunk
    for (let index = 0; index < data.length; index++) {
      const spChunk = data[index];
      // checking if this chunk is end of line
      if (spChunk.includes("\r")) {
        // append last chunk to last row 
        this.lastRow.push(spChunk);
        // removing unnecessary parts from row
        let spLastRow = this.lastRow.join("").split("\r")
        if(spLastRow.length > 2) {
          spLastRow = spLastRow.slice(1);
        }
        // forming resulted row
        this.rows = this.rows.concat(spLastRow.join("\n"));
        this.lastRow = [];
      }
      // append chunk to last row 
      this.lastRow.push(spChunk);
    }
    if(!this.rows.length) {
      return [];
    }
    return this.rows;
  }

  /** 
   * Convert Buffer chunk into array of file rows
   * @param {Buffer[]} data - Chunk data
   * @param {number} count - Chunk iteration count
   * @return {string[]} array of rows
   */
  public process(data: Buffer[], count: number): string[] {
    const rows = data.toString().replace(/\n/g, "\r\n").split("\n");
    const filterRows = this._setLastRow(rows);
    this.rows = [];
    return filterRows;
  }

  /** 
   * Last called method before finish stream processing
   * 
   * Pass the most lastRow to next processing
   * @param {TransformCallback} next - calback use to pass data for next processor
   * @return {void}
   */
  public _flush(next: TransformCallback) {
    if(this.lastRow.length) {
      this.rows = this.rows.concat(this.lastRow.join("").split("\r").slice(1).join("\n"));
    }
    return next(null, this.rows);
  }
}