import Processor from "../processor";

export default class Filter extends Processor {
  public process(csvRow: string[], count: number) {
    let result = csvRow.filter(row => row.split(" - ")[1] === "error");
    return result;
  }
}