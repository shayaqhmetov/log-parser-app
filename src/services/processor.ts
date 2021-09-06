import { Transform, TransformCallback } from "stream";

/**
 * Abstract class for working with file streams
 * 
 * Allows to accept file chunk data as a object or array and return transformed data
 * 
 * Any derived class should implement its own logic overwriting process() function
 * @category Service
 */
export default class Processor extends Transform {
  protected counter: number = 0;
  public options: Record<string, any> = {};

  constructor(options?: Record<string, any>) {
    super({ objectMode: true });
    if (options) {
      this.setOptions(options);
    }
  }

  /** 
   * Process chunk data from stream.
   * @param {object | any[] | string} data - Chunk data
   * @param {number} count - Chunk iteration count
   * @return {object | any[] | string} must return transformed data in the same way as it was accepted
   */
  public process(data: object | any[] | string, count: number): object | any[] | string {
    return data;
  }

  /** 
   * Set options to processor
   * @param {object} options - set of options for processor
   * @return {void}
   */
  public setOptions(options: object) {
    this.options = options;
  }

  /**
   * Function that allows to call Processor's logic
   * 
   * Implemented for compatibility with Transform class
   * @param {object | any[] | string} data - incomming data
   * @param {BufferEncoding} _enc - data encoding
   * @param {TransformCallback} next - calback use to pass data for next processor
   * @return {void}
   */
  public _transform(data: object | any[] | string, _enc: BufferEncoding, next: TransformCallback) {
    try {
      this.counter++;
      return next(null, this.process(data, this.counter));
    } catch (err: any) {
      return next(err);
    }
  }

}
