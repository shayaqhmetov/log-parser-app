import { TransformCallback } from "stream";
import Processor from "../processor";

export default class Reader extends Processor {
  private lastRow: string[];
  private rows: string[];

  constructor() {
    super();
    this.lastRow = [];
    this.rows = [];
  }

  private setLastRow(data: string[]) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      if (element.includes("\r")) {
        this.lastRow.push(element);
        let x = this.lastRow.join("").split("\r")
        if(x.length > 2) {
          x = x.slice(1);
        }
        this.rows = this.rows.concat(x.join("\n"));
        this.lastRow = [];
      }
      this.lastRow.push(element);
    }
    if(!this.rows.length) {
      return null;
    }
    return this.rows;
  }

  public process(csvRow: object, count: number) {
    const rows = csvRow.toString().replace(/\n/g, "\r\n").split("\n");
    console.log(rows);
    const filterRows = this.setLastRow(rows);
    this.rows = [];
    return filterRows;
  }

  public _flush(next: TransformCallback) {
    if(this.lastRow.length) {
      this.rows = this.rows.concat(this.lastRow.join("").split("\r").slice(1).join("\n"));
    }
    return next(null, this.rows);
  }
}