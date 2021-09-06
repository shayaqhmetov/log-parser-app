import Processor from "../processor";

interface iFilterOptions {
  splitKey: string;
  filterKey: string;
}
/**
 * Child class which extends Processor
 * 
 * Filter rows
 * 
 * @category Processor
 */
export default class Filter extends Processor {
  public options: iFilterOptions;
  constructor(options: iFilterOptions) {
    super({ objectMode: false });
    this.options = options;
  }
  /** 
   * Filter rows wich contains specific key
   * @param {string[]} data - Chunk data
   * @param {number} count - Chunk iteration count
   * @return {string[]} array of rows conatining only specific key
   */
  public process(data: string[], count: number) {
    let result = data.filter(row => row.split(this.options["splitKey"])[1] === this.options["filterKey"]);
    return result;
  }
}