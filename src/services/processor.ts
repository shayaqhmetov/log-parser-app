import { Transform, TransformCallback } from "stream";

/**
 * Abstract class for working with CSV streams
 * 
 * Allows to accept CSV row as a object or bulk array and return transformed data
 * 
 * Any derived class should implement its own logic overwriting process() function
 * @category Streams
 */
export default class Processor extends Transform {
  protected counter: number = 0;
  protected options: object = {};

  constructor(options?: object) {
    super({ objectMode: true });
    if (options) {
      this.setOptions(options);
    }
  }

  /** 
   * Process csv row. If there was no headers in CSV, function receives csvRow as array of bulk values
   * @param {object | any[]} csvRow - CSV row data
   * @param {number} count - row counter. Accepts actual row number while working with streams
   * @return {object | any[]} must return transformed data in the same way as it was accepted
   */
  public process(csvRow: object | any[], count: number): object | any[] | null | string {
    return csvRow;
  }

  /** 
   * Set options to processor
   * @param {object} options - set of options for processor
   */
  public setOptions(options: object) {
    this.options = options;
  }

  /**
   * Function that allows to call Processor's logic
   * Implemented for compatibility with Transform class
   * Deprecated for usage
   * @deprecated
   */
  public _transform(row: object, _enc: BufferEncoding, next: TransformCallback) {
    try {
      this.counter++;
      return next(null, this.process(row, this.counter));
    } catch (err: any) {
      return next(err);
    }
  }

}
