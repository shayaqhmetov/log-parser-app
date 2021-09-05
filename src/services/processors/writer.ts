import { TransformCallback } from "stream";
import Processor from "../processor";

export default class Writer extends Processor {
  
  public process(csvRow: string[], count: number): string {
    let result = csvRow.map(row => {
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

  public _flush(next: TransformCallback) {
    return next(null, "]");
  }

}